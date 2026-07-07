/**
 * Custom application error.
 *
 * An Error subclass that carries an HTTP status code. Throw it anywhere in
 * a controller/service (e.g. `throw new ErrorResponse('Form not found', 404)`)
 * and the global error handler will respond with that status and message.
 */
class ErrorResponse extends Error {
    /**
     * @param {string} message - Human-readable error message sent to the client.
     * @param {number} [statusCode=404] - HTTP status code for the response.
     */
    constructor(message, statusCode = 404) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;
