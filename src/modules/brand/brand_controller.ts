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

const getBrands = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.getBrands(req.query);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Brands retrieved successfully',
    data: result,
  });
});

const getBrandById = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.getBrandById(req.params.id as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Brand retrieved successfully',
    data: result,
  });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.updateBrand(
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Brand updated successfully',
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  await BrandService.deleteBrand(req.params.id as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Brand deleted successfully',
    data: null,
  });
});

export const BrandController = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
