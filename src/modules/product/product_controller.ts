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

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await ProductService.deleteProduct(req.params.id as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
});

const createVariableProduct = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductService.createVariableProduct(req.body);

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: 'Variable product created successfully',
      data: result,
    });
  },
);

const updateVariant = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateVariant(
    req.params.variantId as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Variant updated successfully',
    data: result,
  });
});

const deleteVariant = catchAsync(async (req: Request, res: Response) => {
  await ProductService.deleteVariant(req.params.variantId as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Variant deleted successfully',
    data: null,
  });
});

const attachProductMedia = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.attachProductMedia(
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Media attached to product successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createVariableProduct,
  updateVariant,
  deleteVariant,
  attachProductMedia,
};
