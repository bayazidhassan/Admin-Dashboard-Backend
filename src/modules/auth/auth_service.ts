import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';
import { comparePassword } from '../../utils/hash';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new AppError(401, 'Invalid email or password');
  }

  if (!user.active) {
    throw new AppError(403, 'User account is inactive');
  }

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

const getSession = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return {
    id: user.id,
    email: user.email,
    active: user.active,
    role: null,
    permissions: [],
  };
};

export const AuthService = {
  loginUser,
  getSession,
};
