import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../models/user';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    (req as any).user = { id: payload.id, email: payload.email, role: payload.role } as JwtPayload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// role-based helper
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if ((!req as any).user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes((req as any).user.role || '')) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
