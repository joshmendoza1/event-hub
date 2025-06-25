import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Add user from payload to request
    // @ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // @ts-ignore
      const userRole = req.user.role;

      if (!roles.includes(userRole)) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};
