/**
 * Global error handling middleware.
 *
 * `errorHandler` is registered last in index.js, so every error passed to
 * `next(err)` — including ones thrown inside asyncHandler-wrapped handlers —
 * ends up here and is turned into a consistent JSON response:
 *   { code, message, stack? }   (stack only in development)
 */
const httpStatus = require('http-status');
const config = require('../config/config');
const ErrorResponse = require('../utils/errorResponse');
const { Env } = require('../utils/constant');
const { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require('sequelize');

// Sequelize error names that should map to 400 Bad Request instead of 500
const sequelizeErrorNames = ["SequelizeValidationError", "SequelizeUniqueConstraintError"]

/**
 * Normalizes unknown errors into an object with a `statusCode` before they
 * reach errorHandler. Errors that are already ErrorResponse instances pass
 * through unchanged. (Currently not registered in index.js.)
 */
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ErrorResponse)) {

        const statusCode =
            error.statusCode || sequelizeErrorNames.includes(error.name) ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];

        // error = new ErrorResponse(message, statusCode);
        error = {
            statusCode,
            ...error
        }
    }

    next(error);
};

/**
 * Final error handler — converts any error into a JSON response.
 *
 * Sequelize errors get user-friendly messages (first validation message,
 * "Duplicate entry found." for unique violations, dependency messages for
 * FK violations); ErrorResponse instances keep their own message and status;
 * anything else becomes a generic 500 "Internal Server Error".
 * The stack trace is included only in development.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let { message } = err;
    let statusCode = getSatusCode(err)

    if (config.env === Env.production && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        // message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    const endpoint = req.originalUrl || req.path;
    res.locals.errorMessage = err.message;

    if (err instanceof ValidationError) {
        const errors = err.errors.map(error => ({ field: error.path, message: error.message }))
        message = errors[0].message
    } else if (err instanceof UniqueConstraintError) {
        message = "Duplicate entry found."
    } else if (err instanceof ForeignKeyConstraintError && (endpoint.includes('create') || endpoint.includes('register'))) {
        message = "Cannot create record due to wrong data provided.";
    } else if (err instanceof ForeignKeyConstraintError) {
        message = "Cannot delete record due to a dependent data";
    } else if (err instanceof ErrorResponse) {
        message = message
        statusCode = err.statusCode
    } else {
        message = "Internal Server Error"
    }

    const response = {
        code: getSatusCode(err),
        message,
        ...(config.env === Env.development && { stack: err.stack }),
    };


    res.status(statusCode).send(response);
};

/**
 * Resolves the HTTP status code for an error: the error's own statusCode
 * if set, 400 for known Sequelize validation errors, otherwise 500.
 */
const getSatusCode = (error) => {
    return error.statusCode || sequelizeErrorNames.includes(error.name) ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
}

module.exports = {
    errorConverter,
    errorHandler,
};
