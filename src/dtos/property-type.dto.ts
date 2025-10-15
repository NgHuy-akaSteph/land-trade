import { z } from 'zod';

export const PropertyTypeSchema = z.object({
  name: z.string()
    .min(1, 'Tên loại bất động sản không được để trống')
    .max(300, 'Tên loại bất động sản không được vượt quá 300 ký tự')
    .trim(),

});

export type CreatePropertyTypeDTO = z.infer<typeof PropertyTypeSchema>;
export type UpdatePropertyTypeDTO = z.infer<typeof PropertyTypeSchema>;