import { Router } from 'express';
import { testDbConnection } from '../controllers/health.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/health/db:
 *   get:
 *     tags:
 *       - Health
 *     summary: Kiểm tra kết nối database
 *     description: Kiểm tra kết nối tới SQL Server database
 *     responses:
 *       200:
 *         description: Database connection successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 database:
 *                   type: string
 *                   example: connected
 *                 latencyMs:
 *                   type: number
 *                   example: 25
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 message:
 *                   type: string
 *                   example: Database connection successful
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 database:
 *                   type: string
 *                   example: disconnected
 *                 latencyMs:
 *                   type: number
 *                   example: 5000
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 message:
 *                   type: string
 *                   example: Connection timeout
 */
router.get('/health/db', testDbConnection);

export default router;
