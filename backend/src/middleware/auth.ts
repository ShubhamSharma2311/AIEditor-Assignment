import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.token;
    
    console.log('Auth Debug - Cookies:', req.cookies);
    console.log('Auth Debug - Headers:', req.headers.cookie);
    console.log('Auth Debug - Token from cookie:', token ? 'Found' : 'Not found');
    
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
      console.log('Auth Debug - Token from header:', token ? 'Found' : 'Not found');
    }

    if (!token) {
      console.log('Auth Debug - No token found, returning 401');
      res.status(401).json({ 
        error: 'Access token required',
        details: 'No authentication token found in cookies or headers'
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    
    jwt.verify(token, secret, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
      }

      req.userId = decoded.userId;
      next();
    });
  } catch (error: unknown) {
    res.status(500).json({ error: 'Authentication error' });
  }
};
