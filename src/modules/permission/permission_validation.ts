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
    id: z.cuid2({
      error: 'Invalid permission ID',
    }),
  }),
  body: z.object({
    description: z.string().optional(),
    addActions: z.array(z.string()).optional(),
    removePermissionIds: z.array(z.string().min(1)).optional(),
  }),
});

export const deleteGroupValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid permission ID',
    }),
  }),
});

export const deletePermissionValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid permission ID',
    }),
  }),
});

export const getGroupByIdValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid permission ID',
    }),
  }),
});
