import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string()
    .min(1, 'Họ và tên không được để trống')
    .max(200, 'Họ và tên không được vượt quá 200 ký tự')
    .trim(),

  email: z.string()
    .email({ pattern: z.regexes.browserEmail, message: 'Email không hợp lệ' })
    .max(200, 'Email không được vượt quá 200 ký tự')
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được vượt quá 100 ký tự')
    .trim(),

  phone: z.string()
  .min(10, 'Số điện thoại không hợp lệ')
  .max(15, 'Số điện thoại không hợp lệ')
  .regex(/^\+?[0-9\s\-()]+$/, 'Số điện thoại không hợp lệ')
  .trim(),

  avatarUrl: z.string().optional()
});

export const updateUserSchema = z.object({
  fullName: z.string()
    .min(1, 'Họ và tên không được để trống')
    .max(200, 'Họ và tên không được vượt quá 200 ký tự')
    .trim().optional(),

  email: z.string()
    .email({ pattern: z.regexes.browserEmail, message: 'Email không hợp lệ' })
    .max(200, 'Email không được vượt quá 200 ký tự')
    .toLowerCase()
    .trim().optional(),

  phone: z.string()
  .min(10, 'Số điện thoại không hợp lệ')
  .max(15, 'Số điện thoại không hợp lệ')
  .regex(/^\+?[0-9\s\-()]+$/, 'Số điện thoại không hợp lệ')
  .trim().optional(),

  avatarUrl: z.string().optional()
});

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Mật khẩu hiện tại không được để trống'),

  newPassword: z.string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(255, 'Mật khẩu không được vượt quá 255 ký tự'),

  confirmNewPassword: z.string()
    .min(1, 'Xác nhận mật khẩu không được để trống')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
  path: ["confirmNewPassword"]
});


export interface UserResponse {
  id: string;
  email?: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UpdateUserPasswordDTO = z.infer<typeof updateUserPasswordSchema>;
