import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';

const createGroup = async (payload: {
  name: string;
  description?: string;
  actions: string[];
}) => {
  const groupName = payload.name.trim().toLowerCase().replace(/\s+/g, '-');

  const actions = [...new Set(payload.actions)].map((action) =>
    action.trim().toLowerCase().replace(/\s+/g, '-'),
  );

  return prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: {
        name: groupName,
        description: payload.description,
      },
    });

    const permissions = await Promise.all(
      actions.map((action) =>
        tx.permission.create({
          data: {
            name: `${groupName}:${action}`,
            description: `${action} ${groupName}`,
            groupId: group.id,
          },
        }),
      ),
    );

    return {
      ...group,
      permissions,
    };
  });
};

const getGroups = async (query: {
  search?: string;
  page?: string;
  limit?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = query.search?.trim() || '';

  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            permissions: {
              some: {
                name: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            },
          },
        ],
      }
    : {};

  const [items, total] = await prisma.$transaction([
    prisma.group.findMany({
      where,
      include: {
        permissions: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.group.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    limit,
  };
};

const updateGroup = async (
  id: string,
  payload: {
    description?: string;
    addActions?: string[];
    removePermissionIds?: string[];
  },
) => {
  return prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new AppError(404, 'Group not found');
    }

    await tx.group.update({
      where: { id },
      data: {
        description: payload.description,
      },
    });

    if (payload.addActions?.length) {
      const actions = [...new Set(payload.addActions)].map((action) =>
        action.trim().toLowerCase().replace(/\s+/g, '-'),
      );

      await tx.permission.createMany({
        data: actions.map((action) => ({
          name: `${group.name}:${action}`,
          description: `${action} ${group.name}`,
          groupId: id,
        })),
      });
    }

    if (payload.removePermissionIds?.length) {
      await tx.permission.deleteMany({
        where: {
          groupId: id,
          id: {
            in: payload.removePermissionIds,
          },
        },
      });
    }

    return tx.group.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });
  });
};

const deleteGroup = async (id: string) => {
  const permission = await prisma.permission.findUnique({
    where: { id },
  });

  if (!permission) {
    throw new AppError(404, 'Permission not found');
  }

  const roleCount = await prisma.role.count({
    where: {
      permissions: {
        some: {
          id,
        },
      },
    },
  });

  if (roleCount > 0) {
    throw new AppError(
      409,
      'Cannot delete: permission is assigned to one or more roles',
    );
  }

  await prisma.permission.delete({
    where: { id },
  });

  return null;
};

const getGroupById = async (id: string) => {
  const group = await prisma.group.findUnique({
    where: {
      id,
    },
    include: {
      permissions: {
        orderBy: {
          name: 'asc',
        },
      },
    },
  });

  if (!group) {
    throw new AppError(404, 'Permission group not found');
  }

  return group;
};

export const PermissionService = {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  getGroupById,
};
