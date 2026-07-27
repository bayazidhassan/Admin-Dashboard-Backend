import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RoleService } from './role_service';

const createRole = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.createRole(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'Role created successfully',
    data: result,
  });
});

const getRoleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await RoleService.getRoleById(id as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Role retrieved successfully',
    data: result,
  });
});

const getRoles = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.getRoles(req.query);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Roles retrieved successfully',
    data: result,
  });
});

export const RoleController = {
  createRole,
  getRoleById,
  getRoles,
};
