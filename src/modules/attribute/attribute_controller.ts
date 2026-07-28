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

const getAttributeById = catchAsync(async (req: Request, res: Response) => {
  const result = await AttributeService.getAttributeById(
    req.params.id as string,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Attribute retrieved successfully',
    data: result,
  });
});

const updateAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await AttributeService.updateAttribute(
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Attribute updated successfully',
    data: result,
  });
});

const deleteAttribute = catchAsync(async (req: Request, res: Response) => {
  await AttributeService.deleteAttribute(req.params.id as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Attribute deleted successfully',
    data: null,
  });
});

const addAttributeValue = catchAsync(async (req: Request, res: Response) => {
  const result = await AttributeService.addAttributeValue(
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'Attribute value added successfully',
    data: result,
  });
});

const updateAttributeValue = catchAsync(async (req: Request, res: Response) => {
  const result = await AttributeService.updateAttributeValue(
    req.params.valueId as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Attribute value updated successfully',
    data: result,
  });
});

const deleteAttributeValue = catchAsync(async (req: Request, res: Response) => {
  await AttributeService.deleteAttributeValue(req.params.valueId as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Attribute value deleted successfully',
    data: null,
  });
});

export const AttributeController = {
  createAttribute,
  getAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
  addAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
};
