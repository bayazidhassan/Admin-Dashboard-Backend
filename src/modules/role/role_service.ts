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

export const RoleService = {
  createRole,
};
