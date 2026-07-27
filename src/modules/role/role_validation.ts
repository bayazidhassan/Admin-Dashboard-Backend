import { z } from 'zod';

export const createRoleValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    status: z.boolean().optional(),
    permissionIds: z.array(z.string().min(1)).default([]),
  }),
});

export const getRoleByIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Role ID is required'),
  }),
});
