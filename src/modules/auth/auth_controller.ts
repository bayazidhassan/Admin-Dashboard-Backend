import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth_service';

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Login successful.',
    data: result,
  });
});

export const AuthController = {
  login,
};
