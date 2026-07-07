// package imports
const express = require('express');
const xss = require('xss-clean');
const helmet = require('helmet');
const cors = require('cors');

// file imports
const db = require('./config/db');
const config = require('./config/config');
const routes = require('./routes/index');
const ErrorResponse = require('./utils/errorResponse');
const { errorHandler } = require('./middlewares/error');
const { authLimiter } = require('./middlewares/rateLimiter');
const { Env } = require('./utils/constant');
require('colors');

const app = express();
app.set('trust proxy', true)
app.use('/uploads', express.static('uploads'));

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

const startServer = () => {
    return app.listen(config.port, () => {
        console.log(`Listening to port ${config.port}`.bgRed)
    })

}

// routes
app.use('/', routes);


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ErrorResponse('Not found', 404));
});

// handle error
app.use(errorHandler);

// Connect to DB and start the server
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
