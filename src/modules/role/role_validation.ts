import { z } from 'zod';

export const createRoleValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    status: z.boolean().optional(),
    permissionIds: z.array(z.string().min(1)).default([]),
  }),
});
