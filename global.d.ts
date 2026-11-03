import { PrismaClient } from '@prisma/client';

declare global {
  namespace global {
    var prisma: PrismaClient;
  }
}

export {}; 