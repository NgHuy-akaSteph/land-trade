import { prisma } from '../configs/prisma.config';
import { users as User, Prisma } from '@prisma/client';
import { AppException, ErrorCode } from '../exceptions';
import {
  RegisterDTO,
  LoginDTO,
  ChangePasswordDTO,
  AuthResponse,
  TokenPayload,
} from '../dtos/auth.dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ==================== CONSTANTS ====================
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN!;
const DEFAULT_USER_ROLE_ID = process.env.DEFAULT_USER_ROLE_ID!;
const BCRYPT_ROUNDS = 12;

// ==================== HELPER FUNCTIONS ====================

const generateTokens = (
  user: User & { role?: any },
): { accessToken: string; refreshToken: string } => {
  const payload: Omit<TokenPayload, 'type'> = {
    id: user.id,
    fullName: user.fullName,
    roleName: user.role?.name || 'User',
  };

  const accessToken = jwt.sign(
    { ...payload, type: 'access' } as TokenPayload,
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions,
  );

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' } as Partial<TokenPayload>,
    JWT_SECRET as string,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions,
  );

  return { accessToken, refreshToken };
};

const formatAuthResponse = (
  user: User & { role?: any; avatar?: any },
  tokens: { accessToken: string; refreshToken: string },
): AuthResponse => {
  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone!,
      avatarUrl: user.avatar?.url || null,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

// ==================== REGISTER ====================
export const register = async (data: RegisterDTO): Promise<AuthResponse> => {
  // Validate unique email
  const existingEmail = await prisma.users.findUnique({
    where: { email: data.email, isDeleted: false },
  });

  if (existingEmail) {
    throw new AppException(
      ErrorCode.EMAIL_ALREADY_EXISTS,
      'This email is already registered',
    );
  }

  // Validate unique phone
  const existingPhone = await prisma.users.findUnique({
    where: { phone: data.phone, isDeleted: false },
  });

  if (existingPhone) {
    throw new AppException(
      ErrorCode.PHONE_ALREADY_EXISTS,
      'This phone number is already registered',
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

  // Create user
  const user = await prisma.users.create({
    data: {
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      password: hashedPassword,
      roleId: DEFAULT_USER_ROLE_ID,
      avatarId: null, // Will be updated later if user uploads avatar
      nameSearch: data.fullName.toLowerCase(),
    },
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

  // Generate tokens
  const tokens = generateTokens(user);

  return formatAuthResponse(user, tokens);
};

// ==================== LOGIN ====================
export const login = async (data: LoginDTO): Promise<AuthResponse> => {
  // Find user by email with avatar
  const user = await prisma.users.findUnique({
    where: { email: data.email, isDeleted: false },
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

  if (!user) {
    throw new AppException(
      ErrorCode.INVALID_CREDENTIALS,
      'Invalid email or password',
    );
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) {
    throw new AppException(
      ErrorCode.INVALID_CREDENTIALS,
      'Invalid email or password',
    );
  }

  // Generate tokens
  const tokens = generateTokens(user);

  return formatAuthResponse(user, tokens);
};

// ==================== REFRESH TOKEN ====================
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
      id?: string;
      type?: string;
    };

    if (decoded.type !== 'refresh') {
      throw new AppException(ErrorCode.INVALID_TOKEN, 'Invalid token type');
    }

    if (!decoded.id) {
      throw new AppException(ErrorCode.INVALID_TOKEN, 'Invalid token payload');
    }

    // Get user with avatar
    const user = await prisma.users.findUnique({
      where: { id: decoded.id, isDeleted: false },
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

    if (!user) {
      throw new AppException(ErrorCode.USER_NOT_FOUND, 'User not found');
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    return formatAuthResponse(user, tokens);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppException(ErrorCode.TOKEN_EXPIRED, 'Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppException(ErrorCode.INVALID_TOKEN, 'Invalid refresh token');
    }
    throw error;
  }
};

// ==================== GET CURRENT USER ====================
export const getCurrentUser = async (userId: string): Promise<any> => {
  const user = await prisma.users.findUnique({
    where: { id: userId, isDeleted: false },
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

  if (!user) {
    throw new AppException(ErrorCode.USER_NOT_FOUND, 'User not found');
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    roleId: user.roleId,
    roleName: user.role?.name || 'User',
    avatarUrl: user.avatar?.url || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// ==================== CHANGE PASSWORD ====================
export const changePassword = async (
  userId: string,
  data: ChangePasswordDTO,
): Promise<void> => {
  // Get user
  const user = await prisma.users.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new AppException(ErrorCode.USER_NOT_FOUND, 'User not found');
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(
    data.currentPassword,
    user.password,
  );
  if (!isValidPassword) {
    throw new AppException(
      ErrorCode.INVALID_CREDENTIALS,
      'Current password is incorrect',
    );
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(data.newPassword, BCRYPT_ROUNDS);

  // Update password
  await prisma.users.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
};

// ==================== VERIFY TOKEN ====================
export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppException(ErrorCode.TOKEN_EXPIRED, 'Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppException(ErrorCode.INVALID_TOKEN, 'Invalid token');
    }
    throw error;
  }
};
