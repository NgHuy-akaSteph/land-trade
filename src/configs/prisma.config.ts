import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

// Gracefully disconnect Prisma Client on app termination
process.on('beforeExit', async () => {
  console.log('Disconnecting Prisma Client...');
  await prisma.$disconnect();
});



