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
            expiresIn: '60m', // 60 minutes
          }
        );
        
        // Set JWT token as HTTP-only cookie
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('__auth__', token, {
          httpOnly: true,
          secure: isProduction, // Only send over HTTPS in production
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000, // 60 minutes in milliseconds
        });
        
        res.status(200).json({ 
          message: 'Login successful',
          token: token, // Return token in response body for localStorage auth
          user: { id, username, email }
        });
      } else {
        res.status(500).json({ message: 'JWT secret not found' });
      }
    });
  })(req, res, next);
};

// Logout endpoint
export const logoutAdminUser = (req: Request, res: Response) => {
  // Clear the authentication cookie
  res.clearCookie('__auth__', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  
  res.status(200).json({ message: 'Logout successful' });
};
