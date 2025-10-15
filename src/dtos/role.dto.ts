import {z} from 'zod';

export const RoleSchema = z.object({
  name: z.string()
    .min(1, 'Tên vai trò không được để trống')
    .max(100, 'Tên vai trò không được vượt quá 100 ký tự')
    .trim(),
});

export type CreateRoleDTO = z.infer<typeof RoleSchema>;
export type UpdateRoleDTO = z.infer<typeof RoleSchema>;