import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth_service';

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Login successful.',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const session = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getSession(req.user.userId);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Session retrieved successfully',
    data: result,
  });
});

export const AuthController = {
  login,
  session,
};
