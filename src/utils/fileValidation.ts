import fs from 'fs/promises';

import { fileTypeFromBuffer } from 'file-type';

import AppError from '../errors/AppError';

const ALLOWED_MIME_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
];

export const validateFile = async (filePath: string) => {
  const buffer = await fs.readFile(filePath);

  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType) {
    throw new AppError(400, 'Invalid file');
  }

  if (!ALLOWED_MIME_TYPES.includes(fileType.mime)) {
    throw new AppError(400, `Unsupported file type: ${fileType.mime}`);
  }

  return {
    mimeType: fileType.mime,
    extension: fileType.ext,
    type: fileType.mime.startsWith('image/') ? 'image' : 'video',
  };
};
