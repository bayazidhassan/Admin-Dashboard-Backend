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

export const PermissionController = {
  createGroup,
};
