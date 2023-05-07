import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, JwtCustomPayload } from '../types/types';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    res.status(401).json({ error: 'Token error' });
    return;
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ error: 'Token malformatted' });
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
