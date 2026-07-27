import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user_service';

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const result = await UserService.getUsers(req.query);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.id as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getUsers,
  getUserById,
};
