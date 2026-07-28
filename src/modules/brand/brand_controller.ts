import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BrandService } from './brand_service';

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.createBrand(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'Brand created successfully',
    data: result,
  });
});

export const BrandController = {
  createBrand,
};
