import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product_service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProducts(req.query);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductById(req.params.id as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getProducts,
  getProductById,
};
