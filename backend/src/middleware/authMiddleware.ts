import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, JwtCustomPayload } from '../types/types';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.__auth__;

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as JwtCustomPayload;
    (req as any).adminId = payload.adminId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
