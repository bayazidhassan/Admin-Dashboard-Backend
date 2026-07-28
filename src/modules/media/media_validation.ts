import { z } from 'zod';

export const getMediaByIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Media ID is required'),
  }),
});
