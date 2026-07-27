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

export const PermissionService = {
  createGroup,
};
