/**
 * Rate limiting middleware.
 *
 * `authLimiter` limits each client IP to 100 requests per 15-minute window
 * (429 Too Many Requests beyond that). It is applied app-wide in index.js,
 * but only when running in production. The client IP is resolved via the
 * `trust proxy` setting in index.js, so it works correctly behind a
 * reverse proxy.
 */
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100 // Limit each IP to 100 requests per windowMs
});

module.exports = {
    authLimiter,
};
