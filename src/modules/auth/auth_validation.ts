import { z } from 'zod';

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
  }),
});
