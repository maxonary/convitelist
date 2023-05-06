import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  adminId?: number;
}

export interface JwtCustomPayload extends JwtPayload {
  adminId: number;
}