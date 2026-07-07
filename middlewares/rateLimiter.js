const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100 // Limit each IP to 100 requests per windowMs
});

module.exports = {
    authLimiter,
};
