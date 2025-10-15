import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppException, ErrorCode } from '../exceptions';
import { prisma } from '../configs/prisma.config';
import { TokenPayload } from '../dtos/auth.dto';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN!;

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        fullName: string;
        roleName: string;
      };
      currentUser?: any;
    }
  }
}

// ==================== AUTHENTICATE (Verify JWT) ====================
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Lấy token từ Authorization header hoặc từ cookie 'accessToken'
    const authHeader = req.headers.authorization;
    let token: string | null = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (typeof req.headers.cookie === 'string') {
      // Fallback parse cookie thủ công để tránh phụ thuộc cookie-parser
      const cookies = Object.fromEntries(
        req.headers.cookie.split(';').map((c) => {
          const idx = c.indexOf('=');
          const key = c.slice(0, idx).trim();
          const val = decodeURIComponent(c.slice(idx + 1));
          return [key, val];
        }),
      );
      if (cookies.accessToken) {
        token = cookies.accessToken;
      }
    }

    if (!token) {
      throw new AppException(ErrorCode.UNAUTHORIZED, 'No token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (decoded.type !== 'access') {
      throw new AppException(ErrorCode.INVALID_TOKEN, 'Invalid token type');
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      fullName: decoded.fullName,
      roleName: decoded.roleName,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppException(ErrorCode.TOKEN_EXPIRED, 'Token expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppException(ErrorCode.INVALID_TOKEN, 'Invalid token'));
    }
    next(error);
  }
};

// ==================== LOAD CURRENT USER (Full user from DB) ====================
export const loadCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) {
      throw new AppException(ErrorCode.UNAUTHORIZED, 'User not authenticated');
    }

    // Load full user from database
    const currentUser = await prisma.users.findUnique({
      where: { id: req.user.id, isDeleted: false },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        avatar: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    if (!currentUser) {
      throw new AppException(ErrorCode.USER_NOT_FOUND, 'User not found');
    }

    // Attach full user to request
    req.currentUser = currentUser;

    next();
  } catch (error) {
    next(error);
  }
};

// ==================== AUTHORIZE (Check roles) ====================
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppException(
          ErrorCode.UNAUTHORIZED,
          'User not authenticated',
        );
      }

      const hasPermission = allowedRoles.includes(req.user.roleName);

      if (!hasPermission) {
        throw new AppException(
          ErrorCode.FORBIDDEN,
          "You don't have permission to access this resource",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// ==================== OPTIONAL AUTHENTICATE ====================
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | null = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (typeof req.headers.cookie === 'string') {
      const cookies = Object.fromEntries(
        req.headers.cookie.split(';').map((c) => {
          const idx = c.indexOf('=');
          const key = c.slice(0, idx).trim();
          const val = decodeURIComponent(c.slice(idx + 1));
          return [key, val];
        }),
      );
      if (cookies.accessToken) {
        token = cookies.accessToken;
      }
    }

    if (token) {

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

        if (decoded.type === 'access') {
          req.user = {
            id: decoded.id,
            fullName: decoded.fullName,
            roleName: decoded.roleName,
          };
        }
      } catch (err) {
        // Token invalid, but continue without user
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  let isProduction = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: parseExpireTime(JWT_EXPIRES_IN),
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: parseExpireTime(REFRESH_TOKEN_EXPIRES_IN),
  });
}

function parseExpireTime(str: string): number {
  const match = /^(\d+)([smhd])$/.exec(str);
  if (!match) return 0;
  const value = parseInt(match[1] as string, 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 0;
  }
}
