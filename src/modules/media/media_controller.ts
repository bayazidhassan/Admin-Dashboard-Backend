import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MediaService } from './media_service';

const uploadMedia = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.uploadMedia(
    req.files as Express.Multer.File[],
    req.user.id,
  );

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'Media uploaded successfully',
    data: result,
  });
});

export const MediaController = {
  uploadMedia,
};
