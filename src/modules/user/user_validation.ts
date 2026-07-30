import { z } from 'zod';

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),

    email: z.email('Invalid email address'),

    password: z.string().min(8, 'Password must be at least 8 characters'),

    phone: z.string().optional(),

    gender: z.string().optional(),

    avatar: z.string().optional(),

    roleId: z.cuid2({
      error: 'Invalid role ID',
    }),
  }),
});

export const getUserByIdValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid user ID',
    }),
  }),
});

export const updateUserValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid user ID',
    }),
  }),
  body: z.object({
    name: z.string().trim().min(1).optional(),

    email: z.email('Invalid email address').optional(),

    phone: z.string().optional(),

    gender: z.string().optional(),

    avatar: z.string().optional(),

    active: z.boolean().optional(),

    roleId: z
      .cuid2({
        error: 'Invalid role ID',
      })
      .optional(),
  }),
});

export const updateUserStatusValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid user ID',
    }),
  }),
  body: z.object({
    active: z.boolean({
      error: 'Active status must be a boolean',
    }),
  }),
});
