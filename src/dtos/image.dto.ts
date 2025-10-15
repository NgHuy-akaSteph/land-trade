import { z } from 'zod';

export const ImageSchema = z.object({
  url: z.string()
    .trim()
    .optional(),
  publicId: z.string()
    .trim(),
  listingId: z.string().optional(),
});
export type CreateImageDTO = z.infer<typeof ImageSchema>;
export type UpdateImageDTO = z.infer<typeof ImageSchema>;