import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/types';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required. Do not use default secrets in production.');
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // Try to get token from cookie first, then from Authorization header
  let token = req.cookies.__auth__;
  
  // Fallback to Authorization header (Bearer token)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    res.status(401).json({ error: 'No token provided. Please log in.' });
    return;
  }

  try {
    // jwtSecret is validated at module load time, so it's safe to assert here
    // If it were undefined, the application would have failed to start
    const payload = jwt.verify(token, jwtSecret as string);
    
    // jwt.verify can return string | JwtPayload, so we need to check
    if (typeof payload === 'string' || !payload) {
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    // Type guard: check if payload has the required properties
    // Token is created with 'id' field, but we expect 'adminId' in the interface
    const adminId = (payload as any).id || (payload as any).adminId;
    if (!adminId || typeof adminId !== 'number') {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }

    req.adminId = adminId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired. Please log in again.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
}
