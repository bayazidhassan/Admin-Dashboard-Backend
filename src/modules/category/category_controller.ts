import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category_service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
};
