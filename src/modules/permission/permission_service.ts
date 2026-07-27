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

export const PermissionService = {
  createGroup,
  getGroups,
};
