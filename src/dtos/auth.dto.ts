import { z } from 'zod';

// ==================== REGISTER DTO ====================
export const RegisterSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  fullName: z
    .string()
    .min(1, 'Tên không được để trống')
    .max(255, 'Tên quá dài'),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được quá 11 số')
    .regex(/^\d+$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  avatarUrl: z.string().optional(),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

// ==================== LOGIN DTO ====================
export const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

// ==================== CHANGE PASSWORD DTO ====================
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Mật khẩu hiện tại không hợp lệ'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Xác nhận mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>;

// ==================== FORGOT PASSWORD DTO ====================
export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordSchema>;

// ==================== RESET PASSWORD DTO ====================
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Bạn cần cung cấp token đặt lại mật khẩu'),
    newPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 kí tự'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Xác nhận mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

// ==================== REFRESH TOKEN DTO ====================
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Phiên đăng nhập không hợp lệ'),
});

export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;

// ==================== AUTH RESPONSE ====================
export interface AuthResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

// ==================== TOKEN PAYLOAD ====================
export interface TokenPayload {
  id: string;
  fullName: string;
  roleName: string;
  type: 'access' | 'refresh';
}
