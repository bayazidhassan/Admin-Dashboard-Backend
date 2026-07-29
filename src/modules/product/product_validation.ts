import { z } from 'zod';

export const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),

    slug: z.string().trim().min(1),

    sku: z.string().trim().min(1),

    shortDescription: z.string().trim().optional(),

    longDescription: z.string().trim().optional(),

    hasVariants: z.literal(false).optional(),

    price: z.number().positive(),

    salePrice: z.number().positive().optional(),

    stock: z.number().int().min(0),

    weight: z.number().positive().optional(),

    active: z.boolean().optional(),

    featured: z.boolean().optional(),

    sortOrder: z.number().int().optional(),

    brandId: z.string().optional(),

    categoryIds: z.array(z.string()).default([]),
  }),
});

export const getProductByIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
});

export const updateProductValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),

  body: z.object({
    name: z.string().trim().min(1).optional(),

    slug: z.string().trim().min(1).optional(),

    sku: z.string().trim().min(1).optional(),

    shortDescription: z.string().trim().optional(),

    longDescription: z.string().trim().optional(),

    price: z.number().positive().optional(),

    salePrice: z.number().positive().optional(),

    stock: z.number().int().min(0).optional(),

    weight: z.number().positive().optional(),

    active: z.boolean().optional(),

    featured: z.boolean().optional(),

    sortOrder: z.number().int().optional(),

    brandId: z.string().nullable().optional(),

    categoryIds: z.array(z.string()).optional(),
  }),
});
