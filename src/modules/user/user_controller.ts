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

const updateUser = catchAsync(async (req, res) => {
  const result = await UserService.updateUser(
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const result = await UserService.updateUserStatus(
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: `User ${req.body.active ? 'activated' : 'deactivated'} successfully`,
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await UserService.deleteUser(req.params.id as string);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

export const UserController = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
};
