import { z } from 'zod';

export const getMediaByIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Media ID is required'),
  }),
});

export const updateMediaMetadataValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Media ID is required'),
  }),

  body: z.object({
    title: z.string().trim().optional(),
    altText: z.string().trim().optional(),
  }),
});
