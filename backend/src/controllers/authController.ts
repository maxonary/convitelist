import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const prisma = new PrismaClient();
interface Admin {
  username: string;
  password: string;
  email: string;
}

// Create a new admin user
export const createAdminUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body); // logging the request body

    const { username, password, email } = req.body as Admin;

    const existingAdminUser = await prisma.admin.findUnique({
      where: { email: req.body.email },
    });

    if (existingAdminUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdminUser = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        email
      },
    });

    res.status(201).json(newAdminUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Authenticate a user
export const authenticateAdminUser = (req: Request, res: Response) => {
  passport.authenticate('local', (err: Error, user: any) => {
    if (err || !user) {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const { id, username, email } = user;
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        const token = jwt.sign(
          {
            id,
            username,
            email
          },
          jwtSecret,
          {
            expiresIn: '1h',
          }
        );
        res.json({ token });
      } else {
        res.status(500).json({ message: 'JWT secret not found' });
      }
    }
  })(req, res);
};
