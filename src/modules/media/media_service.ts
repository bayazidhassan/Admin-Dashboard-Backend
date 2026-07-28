import fs from 'fs/promises';
import path from 'path';

import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';
import { validateFile } from '../../utils/fileValidation';
import { generateThumbnail } from '../../utils/sharp';

const uploadMedia = async (
  files: Express.Multer.File[],
  uploadedById: string,
) => {
  if (!files || files.length === 0) {
    throw new AppError(400, 'No files uploaded');
  }

  const mediaList = [];

  for (const file of files) {
    try {
      const fileInfo = await validateFile(file.path);

      let width: number | undefined;
      let height: number | undefined;
      let thumbnail: string | undefined;

      if (fileInfo.type === 'image') {
        const result = await generateThumbnail(file.path);

        width = result.width;
        height = result.height;

        thumbnail = `/uploads/thumbnails/${path.basename(
          result.thumbnailPath,
        )}`;
      }

      const media = await prisma.media.create({
        data: {
          fileName: file.originalname,
          storedPath: file.path,
          publicUrl: `/uploads/${path.basename(file.path)}`,
          mimeType: fileInfo.mimeType,
          type: fileInfo.type,
          size: file.size,
          width,
          height,
          thumbnail,
          uploadedById,
        },
      });

      mediaList.push(media);
    } catch (error) {
      await fs.unlink(file.path).catch(() => {});
      throw error;
    }
  }

  return mediaList;
};

export const MediaService = {
  uploadMedia,
};
