import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';
import { getJwtSecret } from '../config/security';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string; email: string; role: string };

    const userRes = await query(
      'SELECT id, email, role, full_name, is_active FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userRes.rowCount === 0 || !userRes.rows[0].is_active) {
      res.status(401).json({ success: false, message: 'Invalid token or inactive user account.' });
      return;
    }

    req.user = {
      id: userRes.rows[0].id,
      email: userRes.rows[0].email,
      role: userRes.rows[0].role,
      fullName: userRes.rows[0].full_name
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'super_admin') {
    res.status(403).json({ success: false, message: 'Forbidden. Super Admin access required.' });
    return;
  }
  next();
};
