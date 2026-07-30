import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PermissionService } from './permission_service';

const createGroup = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.createGroup(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'Permission group created successfully',
    data: result,
  });
});

const getGroups = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.getGroups(req.query);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Permission groups retrieved successfully',
    data: result,
  });
});

const updateGroup = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PermissionService.updateGroup(id as string, req.body);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Permission group updated successfully',
    data: result,
  });
});

const deleteGroup = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await PermissionService.deleteGroup(id as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Permission deleted successfully',
    data: null,
  });
});

const getGroupById = catchAsync(async (req, res) => {
  const result = await PermissionService.getGroupById(req.params.id as string);

  sendResponse({
    res,
    success: true,
    statusCode: 200,
    message: 'Permission group retrieved successfully',
    data: result,
  });
});

export const PermissionController = {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  getGroupById,
};
