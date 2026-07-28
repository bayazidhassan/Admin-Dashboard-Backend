import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AttributeService } from './attribute_service';

const createAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await AttributeService.createAttribute(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'Attribute created successfully',
    data: result,
  });
});

const getAttributes = catchAsync(async (req: Request, res: Response) => {
  const result = await AttributeService.getAttributes(req.query);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Attributes retrieved successfully',
    data: result,
  });
});

export const AttributeController = {
  createAttribute,
};
