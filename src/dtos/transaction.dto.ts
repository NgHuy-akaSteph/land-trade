import { z } from 'zod';

export const CreateTransactionDTO = z.object({

});

export const UpdateTransactionDTO = z.object({

});

export type CreateTransactionDTO = z.infer<typeof CreateTransactionDTO>;
export type UpdateTransactionDTO = z.infer<typeof UpdateTransactionDTO>;