import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.config';

export const testDbConnection = async (_req: Request, res: Response) => {
  const started = Date.now();
  try {
    // Test connection với query đơn giản
    await prisma.$queryRaw`SELECT 1 as test`;

    res.json({
      status: 'success',
      database: 'connected',
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
      message: 'Database connection successful',
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
      message: error.message || 'Database connection failed',
    });
  }
};
