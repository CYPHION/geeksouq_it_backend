/**
 * System controller.
 *
 * Handlers for the unversioned system endpoints: backend info (GET /)
 * and the health check (GET /health).
 */
const asyncHandler = require("../utils/asyncHandler");
const db = require('../config/db');
const config = require('../config/config');
const { Env } = require('../utils/constant');
const { name, version, description } = require('../package.json');

/**
 * GET /
 * Returns basic backend info (name/version/description from package.json,
 * current environment, and useful links). The Swagger docs link is only
 * included outside production, where the /api-docs route actually exists.
 */
exports.getInfo = asyncHandler(async (req, res) => {
    const info = {
        name,
        version,
        description,
        environment: config.env,
        apiBaseUrl: '/api/v1',
        health: '/health',
    };

    if (config.env !== Env.production) {
        info.docs = '/api-docs';
    }

    return res.send(info);
})

/**
 * GET /health
 * Health check for uptime monitors / load balancers. Pings the database
 * with `db.authenticate()` and responds:
 * - 200 { status: 'ok' }       → server and database both reachable
 * - 503 { status: 'degraded' } → server up but database unreachable
 */
exports.getHealth = asyncHandler(async (req, res) => {
    let database = 'up';

    try {
        await db.authenticate();
    } catch (error) {
        database = 'down';
    }

    const healthy = database === 'up';

    return res.status(healthy ? 200 : 503).send({
        status: healthy ? 'ok' : 'degraded',
        server: 'up',
        database,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
})
