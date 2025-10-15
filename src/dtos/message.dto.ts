import { z } from 'zod';

export const MessageSchema = z.object({

});

export type CreateMessageDTO = z.infer<typeof MessageSchema>;
export type UpdateMessageDTO = z.infer<typeof MessageSchema>;