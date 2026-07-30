import { z } from 'zod';

export const getMediaByIdValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid media ID',
    }),
  }),
});

export const updateMediaMetadataValidationSchema = z.object({
  params: z.object({
    id: z.cuid2({
      error: 'Invalid media ID',
    }),
  }),

  body: z.object({
    title: z.string().trim().optional(),
    altText: z.string().trim().optional(),
  }),
});
