/**
 * Application entry point.
 *
 * Sets up the Express app: global middleware (body parsing, sanitization,
 * security headers, CORS, rate limiting), Swagger docs (non-production only),
 * route mounting, error handling — then syncs the database and starts the server.
 */

// package imports
const express = require('express');
const xss = require('xss-clean');
const helmet = require('helmet');
const cors = require('cors');

// file imports
const db = require('./config/db');
const config = require('./config/config');
const routes = require('./routes/index');
const healthRoutes = require('./routes/health.routes');
const ErrorResponse = require('./utils/errorResponse');
const { errorHandler } = require('./middlewares/error');
const { authLimiter } = require('./middlewares/rateLimiter');
const { Env } = require('./utils/constant');
require('colors');

const app = express();


// trust only the first proxy hop (reverse proxy / load balancer) so
// clients cannot spoof their IP via X-Forwarded-For to bypass rate limiting
app.set('trust proxy', 1)

// serve uploaded files statically, e.g. GET /uploads/<filename>
app.use('/uploads', express.static('uploads'));

// parse JSON and url-encoded request bodies (large limits to allow big form payloads)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
}))

// sanitize request data
app.use(xss());

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors());
app.options('*', cors());

// app.use(errorHandler);

// limit repeated failed requests to auth endpoints
if (config.env === Env.production) {
    app.use(authLimiter);
}

/**
 * Starts the HTTP server on the configured port.
 * Called only after the database has synced successfully.
 */
const startServer = () => {
    return app.listen(config.port, () => {
        console.log(`Listening to port ${config.port}`.bgRed)
    })

}

// swagger api docs (disabled in production)
if (config.env !== Env.production) {
    const swaggerUi = require('swagger-ui-express');
    const swaggerSpec = require('./config/swagger');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// system routes (backend info + health check) — unversioned
app.use('/', healthRoutes);

// feature API routes — versioned under /api/v1
app.use('/api/v1', routes);


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ErrorResponse('Not found', 404));
});

// handle error
app.use(errorHandler);

/**
 * Syncs Sequelize models with the database (creates/updates tables),
 * then starts the HTTP server. Exits early (server never starts) if the sync fails.
 */
const syncDatabaseAndStartServer = async () => {
    try {
        await db.sync();
        console.log('\nDatabase synced successfully'.cyan.bold);
        startServer();
    } catch (error) {
        console.error('Database sync failed:', error);
    }
};

syncDatabaseAndStartServer();
