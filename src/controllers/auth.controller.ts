import { Request, Response } from 'express';
import {
  RegisterSchema,
  LoginSchema,
  ChangePasswordSchema,
  RefreshTokenSchema,
} from '../dtos';
import {
  register,
  login,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
} from '../services/auth.service';
import { asyncHandler, setAuthCookies } from '../middlewares';
import { ResponseUtil } from '../utils/response.util';

// ==================== REGISTER ====================
export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const dto = RegisterSchema.parse(req.body);
    const result = await register(dto);
    return ResponseUtil.success(res, result, 'Đăng ký thành công', 201);
  },
);

// ==================== LOGIN ====================
export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const dto = LoginSchema.parse(req.body);
    const result = await login(dto);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return ResponseUtil.success(res, result, 'Đăng nhập thành công', 200);
  },
);

// ==================== REFRESH TOKEN ====================
export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = RefreshTokenSchema.parse(req.body);
    const result = await refreshAccessToken(refreshToken);
    return ResponseUtil.success(res, result, 'Phiên đăng nhập mới', 200);
  },
);

// ==================== GET CURRENT USER ====================
export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const user = await getCurrentUser(userId);
    return ResponseUtil.success(res, user, 'Lấy thông tin người dùng thành công');
  },
);

// ==================== CHANGE PASSWORD ====================
export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const dto = ChangePasswordSchema.parse(req.body);
    await changePassword(userId, dto);
    return ResponseUtil.success(res, null, 'Đổi mật khẩu thành công');
  },
);

// ==================== LOGOUT ====================
export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    res.clearCookie('accessToken', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax' , path: '/'
    });
    res.clearCookie('refreshToken', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax' , path: '/'
    });
    return ResponseUtil.success(res, null, 'Đăng xuất thành công');
  },
);
