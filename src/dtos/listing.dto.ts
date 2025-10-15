import {z} from 'zod';
import { PropertyType } from '../models';


export const createListingSchema = z.object({
  title: z.string()
    .min(5, 'Tiêu đề không được để trống')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự')
    .trim(),

  description: z.string()
    .max(2000, 'Mô tả không được vượt quá 2000 ký tự')
    .trim()
    .optional(),

  address: z.string()
    .min(10, 'Địa chỉ không được để trống')
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .trim(),

  price: z.number()
    .positive('Giá phải là số dương')
    .max(1_000_000_000_000, 'Giá quá lớn không hợp lệ'),

  area: z.number()
    .positive('Diện tích phải là số dương')
    .max(1_000_000, 'Diện tích quá lớn không hợp lệ'),
  
  frontage: z.number()
    .positive('Chiều rộng mặt tiền phải là số dương')
    .max(1000, 'Chiều rộng mặt tiền quá lớn không hợp lệ')
    .optional(),

  depth: z.number()
    .positive('Chiều dài phải là số dương')
    .max(1000, 'Chiều dài quá lớn không hợp lệ')
    .optional(),
  
  direction: z.string(),

  latitude: z.number()
    .min(-90, 'Vĩ độ không hợp lệ')
    .max(90, 'Vĩ độ không hợp lệ')
    .optional(),
  
  longitude: z.number()
    .min(-180, 'Kinh độ không hợp lệ')
    .max(180, 'Kinh độ không hợp lệ')
    .optional(),

  PropertyTypeId: z.string(),
  image : z.array(z.string())
});

export const updateListingSchema = z.object({
  title: z.string()
    .min(5, 'Tiêu đề không được để trống')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự')
    .trim()
    .optional(),

  description: z.string()
    .max(2000, 'Mô tả không được vượt quá 2000 ký tự')
    .trim()
    .optional(),

  address: z.string()
    .min(10, 'Địa chỉ không được để trống')
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .trim()
    .optional(),

  price: z.number()
    .positive('Giá phải là số dương')
    .max(1_000_000_000_000, 'Giá quá lớn không hợp lệ')
    .optional(),

  area: z.number()
    .positive('Diện tích phải là số dương')
    .max(1_000_000, 'Diện tích quá lớn không hợp lệ')
    .optional(),
  
  frontage: z.number()
    .positive('Chiều rộng mặt tiền phải là số dương')
    .max(1000, 'Chiều rộng mặt tiền quá lớn không hợp lệ')
    .optional(),

  depth: z.number()
    .positive('Chiều dài phải là số dương')
    .max(1000, 'Chiều dài quá lớn không hợp lệ')
    .optional(),
  
  direction: z.string().optional(),

  latitude: z.number()
    .min(-90, 'Vĩ độ không hợp lệ')
    .max(90, 'Vĩ độ không hợp lệ')
    .optional(),
  
  longitude: z.number()
    .min(-180, 'Kinh độ không hợp lệ')
    .max(180, 'Kinh độ không hợp lệ')
    .optional(),

  PropertyTypeId: z.string().optional(),
  image : z.array(z.string()).optional()
});

export type CreateListingDTO = z.infer<typeof createListingSchema>;
export type UpdateListingDTO = z.infer<typeof updateListingSchema>;
