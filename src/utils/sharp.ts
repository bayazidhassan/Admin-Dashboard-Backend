import fs from 'fs';
import path from 'path';

import sharp from 'sharp';

const thumbnailDir = path.join(process.cwd(), 'uploads', 'thumbnails');

if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

export const generateThumbnail = async (
  imagePath: string,
): Promise<{
  thumbnailPath: string;
  width: number;
  height: number;
}> => {
  const fileName = path.basename(imagePath);
  const thumbnailPath = path.join(thumbnailDir, fileName);

  const metadata = await sharp(imagePath).metadata();

  await sharp(imagePath)
    .resize({
      width: 300,
      height: 300,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFile(thumbnailPath);

  return {
    thumbnailPath,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
};
