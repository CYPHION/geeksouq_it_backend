class ErrorResponse extends Error {
    constructor(message, statusCode = 404) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;
