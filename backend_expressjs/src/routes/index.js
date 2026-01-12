const express = require('express');
const healthController = require('../controllers/health');
const tasksRoutes = require('./tasks');

const router = express.Router();
// Health endpoint

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /health/db:
 *   get:
 *     summary: Database health endpoint
 *     description: Verifies database connectivity with a lightweight query.
 *     responses:
 *       200:
 *         description: Database reachable
 *       503:
 *         description: Database not reachable
 */
router.get('/health/db', healthController.checkDb.bind(healthController));

// Tasks endpoints
router.use('/tasks', tasksRoutes);

module.exports = router;
