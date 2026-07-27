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

export const RoleController = {
  createRole,
};
