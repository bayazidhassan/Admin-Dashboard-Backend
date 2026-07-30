import { z } from 'zod';

export const createBrandValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),

    slug: z.string().trim().min(1, 'Slug is required'),

    logo: z.string().trim().optional(),

    status: z.boolean().optional(),

    description: z.string().trim().optional(),
  }),
});

export const getBrandByIdValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid brand ID',
    }),
  }),
});

export const updateBrandValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid brand ID',
    }),
  }),

  body: z.object({
    name: z.string().trim().min(1).optional(),

    slug: z.string().trim().min(1).optional(),

    logo: z.string().trim().optional(),

    status: z.boolean().optional(),

    description: z.string().trim().optional(),
  }),
});
