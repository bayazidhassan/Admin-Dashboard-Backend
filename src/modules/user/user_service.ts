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

const getUsers = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search as string | undefined;
  const roleId = query.roleId as string | undefined;
  const active =
    query.active !== undefined ? query.active === 'true' : undefined;

  const where: any = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (roleId) {
    where.roleId = roleId;
  }

  if (active !== undefined) {
    where.active = active;
  }

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    }),
    prisma.user.count({
      where,
    }),
  ]);

  const users = items.map(({ password, ...user }) => user);

  return {
    items: users,
    total,
    page,
    limit,
  };
};

export const UserService = {
  createUser,
  getUsers,
};
