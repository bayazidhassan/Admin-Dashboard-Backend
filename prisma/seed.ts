import 'dotenv/config';

import prisma from '../src/lib/prisma';
import { hashPassword } from '../src/utils/hash';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('User already exists.');
    return;
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      active: true,
    },
  });

  console.log('Seed user created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
