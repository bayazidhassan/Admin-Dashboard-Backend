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
