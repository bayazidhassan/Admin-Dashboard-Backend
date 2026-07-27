import { z } from 'zod';

export const createGroupValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    actions: z.array(z.string()).min(1),
  }),
});

export const updateGroupValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
  body: z.object({
    description: z.string().optional(),
    addActions: z.array(z.string()).optional(),
    removePermissionIds: z.array(z.string().min(1)).optional(),
  }),
});

export const deletePermissionValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
});
