import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';
import { hashPassword } from '../../utils/hash';

const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  avatar?: string;
  roleId: string;
}) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError(409, 'Email already exists');
  }

  // Check if role exists
  const role = await prisma.role.findUnique({
    where: {
      id: payload.roleId,
    },
  });

  if (!role) {
    throw new AppError(404, 'Role not found');
  }

  // Hash password
  const hashedPassword = await hashPassword(payload.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      gender: payload.gender,
      avatar: payload.avatar,
      roleId: payload.roleId,
    },
    include: {
      role: true,
    },
  });

  // Remove password from response
  const { password, ...result } = user;

  return result;
};

export const UserService = {
  createUser,
};
