import { z } from 'zod';

export const createAttributeValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),

    slug: z.string().trim().min(1, 'Slug is required'),

    type: z.enum([
      'dropdown',
      'radio',
      'checkbox',
      'color_swatch',
      'image_swatch',
    ]),
  }),
});

export const getAttributeByIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Attribute ID is required'),
  }),
});

export const updateAttributeValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Attribute ID is required'),
  }),

  body: z.object({
    name: z.string().trim().min(1).optional(),

    slug: z.string().trim().min(1).optional(),

    type: z
      .enum(['dropdown', 'radio', 'checkbox', 'color_swatch', 'image_swatch'])
      .optional(),
  }),
});

export const addAttributeValueValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Attribute ID is required'),
  }),

  body: z.object({
    value: z.string().trim().min(1, 'Value is required'),

    slug: z.string().trim().min(1, 'Slug is required'),

    referenceValue: z.string().trim().optional(),
  }),
});
