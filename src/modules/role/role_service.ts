import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';

const createRole = async (payload: {
  name: string;
  description?: string;
  status?: boolean;
  permissionIds: string[];
}) => {
  const roleName = payload.name.trim().toLowerCase().replace(/\s+/g, '-');

  const role = await prisma.role.create({
    data: {
      name: roleName,
      description: payload.description,
      status: payload.status ?? true,
      permissions: {
        connect: payload.permissionIds.map((id) => ({ id })),
      },
    },
    include: {
      permissions: true,
    },
  });

  return role;
};

const getRoleById = async (id: string) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      permissions: true,
    },
  });

  if (!role) {
    throw new AppError(404, 'Role not found');
  }

  return role;
};

export const RoleService = {
  createRole,
  getRoleById,
};
