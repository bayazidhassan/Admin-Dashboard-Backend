import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './lib/prisma';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected');

    app.listen(PORT, () =>
      console.log(
        `Admin Dashboard server is running on port ${process.env.PORT}`,
      ),
    );
  } catch (error) {
    console.error('❌ Failed to start server: ', error);
    process.exit(1);
  }
};

startServer();
