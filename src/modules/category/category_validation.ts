import { z } from 'zod';

export const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),

    slug: z.string().trim().min(1, 'Slug is required'),

    description: z.string().trim().optional(),

    image: z.string().trim().optional(),

    parentId: z.string().trim().optional(),

    active: z.boolean().optional(),

    sortOrder: z.number().int().optional(),
  }),
});

export const getCategoryByIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
});

export const updateCategoryValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),

  body: z.object({
    name: z.string().trim().min(1).optional(),

    slug: z.string().trim().min(1).optional(),

    description: z.string().trim().optional(),

    image: z.string().trim().optional(),

    parentId: z.string().trim().optional(),

    active: z.boolean().optional(),

    sortOrder: z.number().int().optional(),
  }),
});
