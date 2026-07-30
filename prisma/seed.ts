import 'dotenv/config';

import { PERMISSION_GROUPS } from '../src/constants/permissions';
import prisma from '../src/lib/prisma';
import { hashPassword } from '../src/utils/hash';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env');
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
    `Permissions Assigned: ${adminRoleWithPermissions?.permissions.length ?? 0}`,
  );
  console.log('Admin Role Created/Updated');
  console.log(`Admin Email: ${email}`);
  console.log(`Admin Password: ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
