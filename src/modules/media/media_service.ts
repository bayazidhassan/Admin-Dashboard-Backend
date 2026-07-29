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

const getMediaList = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search) {
    where.OR = [
      {
        fileName: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
      {
        title: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
      {
        altText: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
    ];
  }

  if (query.type) {
    where.type = String(query.type);
  }

  const [items, total] = await prisma.$transaction([
    prisma.media.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),

    prisma.media.count({
      where,
    }),
  ]);

  return {
    items,
    total,
    page,
    limit,
  };
};

const getMediaById = async (id: string) => {
  const media = await prisma.media.findUnique({
    where: {
      id,
    },
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!media) {
    throw new AppError(404, 'Media not found');
  }

  return media;
};

const updateMediaMetadata = async (
  id: string,
  payload: {
    title?: string;
    altText?: string;
  },
) => {
  const media = await prisma.media.findUnique({
    where: {
      id,
    },
  });

  if (!media) {
    throw new AppError(404, 'Media not found');
  }

  return await prisma.media.update({
    where: {
      id,
    },
    data: {
      title: payload.title,
      altText: payload.altText,
    },
  });
};

const deleteMedia = async (id: string) => {
  const media = await prisma.media.findUnique({
    where: {
      id,
    },
  });

  if (!media) {
    throw new AppError(404, 'Media not found');
  }

  const mediaInUse = await prisma.productMedia.findFirst({
    where: {
      mediaId: id,
    },
    select: {
      id: true,
      productId: true,
      variantId: true,
      attributeValueId: true,
    },
  });

  if (mediaInUse) {
    throw new AppError(
      409,
      'Cannot delete media because it is attached to a product, variant, or attribute value',
    );
  }

  await prisma.media.delete({
    where: {
      id,
    },
  });

  await fs.unlink(media.storedPath).catch(() => {});

  if (media.thumbnail) {
    const thumbnailPath = path.join(
      process.cwd(),
      media.thumbnail.replace(/^\//, ''),
    );

    await fs.unlink(thumbnailPath).catch(() => {});
  }

  return null;
};

export const MediaService = {
  uploadMedia,
  getMediaList,
  getMediaById,
  updateMediaMetadata,
  deleteMedia,
};
