import 'dotenv/config';

import prisma from '../src/lib/prisma';
import { hashPassword } from '../src/utils/hash';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env');
  }

  // Get all existing permissions
  const allPermissions = await prisma.permission.findMany({
    select: {
      id: true,
    },
  });

  // Create or update Admin role
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

  // Create or update Admin user
  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
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

  console.log('✅ Database seeded successfully!');
  console.log(`Admin Email: ${email}`);
  console.log(`Admin Password: ${password}`);
  console.log(`Permissions Assigned: ${allPermissions.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
