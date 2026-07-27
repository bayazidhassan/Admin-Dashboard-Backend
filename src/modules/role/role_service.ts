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

const getRoles = async (query: {
  search?: string;
  page?: string;
  limit?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = query.search
    ? {
        name: {
          contains: query.search,
          mode: 'insensitive' as const,
        },
      }
    : {};

  const [items, total] = await prisma.$transaction([
    prisma.role.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        permissions: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    }),
    prisma.role.count({
      where,
    }),
  ]);

  return {
    items,
    total,
    page,
    limit,
  };
};

const updateRole = async (
  id: string,
  payload: {
    description?: string;
    status?: boolean;
    addPermissionIds?: string[];
    removePermissionIds?: string[];
  },
) => {
  return prisma.$transaction(async (tx) => {
    const role = await tx.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new AppError(404, 'Role not found');
    }

    await tx.role.update({
      where: { id },
      data: {
        description: payload.description,
        status: payload.status,
      },
    });

    if (payload.addPermissionIds?.length) {
      await tx.role.update({
        where: { id },
        data: {
          permissions: {
            connect: payload.addPermissionIds.map((permissionId) => ({
              id: permissionId,
            })),
          },
        },
      });
    }

    if (payload.removePermissionIds?.length) {
      await tx.role.update({
        where: { id },
        data: {
          permissions: {
            disconnect: payload.removePermissionIds.map((permissionId) => ({
              id: permissionId,
            })),
          },
        },
      });
    }

    return tx.role.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });
  });
};

const grantAllPermissions = async (id: string) => {
  const role = await prisma.role.findUnique({
    where: { id },
  });

  if (!role) {
    throw new AppError(404, 'Role not found');
  }

  const permissions = await prisma.permission.findMany({
    select: {
      id: true,
    },
  });

  await prisma.role.update({
    where: { id },
    data: {
      permissions: {
        connect: permissions.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });

  return prisma.role.findUnique({
    where: { id },
    include: {
      permissions: true,
    },
  });
};

const deleteRole = async (id: string) => {
  const role = await prisma.role.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  if (!role) {
    throw new AppError(404, 'Role not found');
  }

  if (role._count.users > 0) {
    throw new AppError(
      409,
      'Cannot delete role because it is assigned to one or more users',
    );
  }

  await prisma.role.delete({
    where: {
      id,
    },
  });

  return null;
};

export const RoleService = {
  createRole,
  getRoleById,
  getRoles,
  updateRole,
  grantAllPermissions,
  deleteRole,
};
