import { NextFunction, Request, Response } from 'express';

import AppError from '../errors/AppError';
import prisma from '../lib/prisma';
import { verifyAccessToken } from '../utils/jwt';

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized');
  }

  const token = authorization.split(' ')[1];

  const decoded = verifyAccessToken(token);

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
    include: {
      role: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(401, 'User not found');
  }

  if (!user.active) {
    throw new AppError(403, 'User is deactivated');
  }

  req.user = {
    id: user.id,
    email: user.email,
    roleId: user.roleId,
    permissions: user.role.permissions.map((permission) => permission.name),
  };

  next();
};

export default authenticate;
