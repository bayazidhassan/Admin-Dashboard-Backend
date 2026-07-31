import 'dotenv/config';

import { PERMISSION_GROUPS } from '../src/constants/permissions';
import prisma from '../src/lib/prisma';
import { hashPassword } from '../src/utils/hash';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const managerEmail = process.env.MANAGER_EMAIL;
  const managerPassword = process.env.MANAGER_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env');
  }

  if (!managerEmail || !managerPassword) {
    throw new Error(
      'MANAGER_EMAIL and MANAGER_PASSWORD must be defined in .env',
    );
  }

  for (const group of PERMISSION_GROUPS) {
    const createdGroup = await prisma.group.upsert({
      where: {
        name: group.name,
      },
      update: {
        description: group.description,
      },
      create: {
        name: group.name,
        description: group.description,
      },
    });

    for (const permission of group.permissions) {
      await prisma.permission.upsert({
        where: {
          name: permission.name,
        },
        update: {
          description: permission.description,
          groupId: createdGroup.id,
        },
        create: {
          name: permission.name,
          description: permission.description,
          groupId: createdGroup.id,
        },
      });
    }
  }

  const allPermissions = await prisma.permission.findMany({
    select: {
      id: true,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: {
      name: 'admin',
    },
    update: {
      description: 'System Administrator',
      status: true,
      permissions: {
        set: allPermissions.map((permission) => ({
          id: permission.id,
        })),
      },
    },
    create: {
      name: 'admin',
      description: 'System Administrator',
      status: true,
      permissions: {
        connect: allPermissions.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });

  const hashedPassword = await hashPassword(password);

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name: 'System Admin',
      password: hashedPassword,
      roleId: adminRole.id,
      active: true,
    },
    create: {
      name: 'System Admin',
      email,
      password: hashedPassword,
      roleId: adminRole.id,
      active: true,
    },
  });

  // --- Limited "Manager" role + user ---
  // Catalog-only access: full Category management (watch, create, read, update, delete) only.
  //No permission/role/user/brand/attribute/media/product access.
  //This lets reviewers verify 403 behaviour on every other module's routes.

  const managerPermissionNames = [
    'category:watch',
    'category:create',
    'category:read',
    'category:update',
    'category:delete',
  ];

  const managerPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: managerPermissionNames,
      },
    },
    select: {
      id: true,
    },
  });

  if (managerPermissions.length !== managerPermissionNames.length) {
    throw new Error(
      'One or more manager permissions were not found. Check PERMISSION_GROUPS.',
    );
  }

  const managerRole = await prisma.role.upsert({
    where: {
      name: 'manager',
    },
    update: {
      description: 'Limited catalog manager (products and brand creation only)',
      status: true,
      permissions: {
        set: managerPermissions.map((permission) => ({
          id: permission.id,
        })),
      },
    },
    create: {
      name: 'manager',
      description: 'Limited catalog manager (products and brand creation only)',
      status: true,
      permissions: {
        connect: managerPermissions.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });

  const hashedManagerPassword = await hashPassword(managerPassword);

  await prisma.user.upsert({
    where: {
      email: managerEmail,
    },
    update: {
      name: 'Limited Manager',
      password: hashedManagerPassword,
      roleId: managerRole.id,
      active: true,
    },
    create: {
      name: 'Limited Manager',
      email: managerEmail,
      password: hashedManagerPassword,
      roleId: managerRole.id,
      active: true,
    },
  });

  const adminRoleWithPermissions = await prisma.role.findUnique({
    where: {
      id: adminRole.id,
    },
    include: {
      permissions: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Groups Created: ${PERMISSION_GROUPS.length}`);
  console.log(`Permissions Created: ${allPermissions.length}`);
  console.log(
    `Permissions Assigned to Admin: ${adminRoleWithPermissions?.permissions.length ?? 0}`,
  );
  console.log('Admin Role Created/Updated');
  console.log(`Admin Email: ${email}`);
  console.log(`Admin Password: ${password}`);
  console.log('---');
  console.log('Manager Role Created/Updated');
  console.log(`Manager Permissions: ${managerPermissionNames.join(', ')}`);
  console.log(`Manager Email: ${managerEmail}`);
  console.log(`Manager Password: ${managerPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
