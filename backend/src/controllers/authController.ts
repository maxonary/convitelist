import { NextFunction, Request, Response } from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

// Authenticate a user
export const authenticateAdminUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message || 'Invalid username or password' });
    }
    req.logIn(user, (loginErr: Error) => {
      if (loginErr) {
        return next(loginErr);
      }

      const { id, username, email } = user;
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        const token = jwt.sign(
          {
            id,
            username,
            email,
          },
          jwtSecret,
          {
            expiresIn: 60, // in minutes
          }
        );
        res.status(200).json({ token });
      } else {
        res.status(500).json({ message: 'JWT secret not found' });
      }
    });
  })(req, res, next);
};
