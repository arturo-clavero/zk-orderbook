import { PrismaClient as TradingClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: TradingClient };

export const prisma =
  globalForPrisma.prisma ??
  new TradingClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { TradingClient };
