/**
 * Wraps an async Express route handler so that any rejected promise is
 * forwarded to `next()` — and therefore to the global error handler —
 * instead of every handler needing its own try/catch.
 *
 * Usage:
 *   router.get('/all', asyncHandler(async (req, res) => { ... }));
 *
 * @param {Function} fn - Async (req, res, next) handler.
 * @returns {Function} an Express-compatible handler with error forwarding
 */
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
