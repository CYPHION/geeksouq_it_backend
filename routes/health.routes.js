/**
 * System routes — mounted at the app root (unversioned).
 *
 * GET /        → backend info (name, version, environment, useful links)
 * GET /health  → server + database health check (for uptime monitors / load balancers)
 * The `@swagger` blocks below are parsed by swagger-jsdoc (see config/swagger.js)
 * to generate the interactive docs at /api-docs.
 */
const express = require('express');
const healthController = require('../controller/health.controller');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Backend info
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Basic information about the backend
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: geeksouq-backend
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 description:
 *                   type: string
 *                   example: geeksouq backend
 *                 environment:
 *                   type: string
 *                   example: development
 *                 apiBaseUrl:
 *                   type: string
 *                   example: /api/v1
 *                 health:
 *                   type: string
 *                   example: /health
 *                 docs:
 *                   type: string
 *                   example: /api-docs
 */
router.get('/', healthController.getInfo);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Server and database health
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server and database are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 server:
 *                   type: string
 *                   example: up
 *                 database:
 *                   type: string
 *                   example: up
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 123.45
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: Database is down
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: degraded
 *                 server:
 *                   type: string
 *                   example: up
 *                 database:
 *                   type: string
 *                   example: down
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', healthController.getHealth);

module.exports = router;
