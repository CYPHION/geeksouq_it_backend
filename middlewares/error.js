const httpStatus = require('http-status');
const config = require('../config/config');
const ErrorResponse = require('../utils/errorResponse');
const { Env } = require('../utils/constant');
const { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require('sequelize');

const sequelizeErrorNames = ["SequelizeValidationError", "SequelizeUniqueConstraintError"]

// in place of SQL error instance SQL error should be replaced like the below mongoose error below
// error instanceof mongoose.Error
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

const getSatusCode = (error) => {
    return error.statusCode || sequelizeErrorNames.includes(error.name) ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
}

module.exports = {
    errorConverter,
    errorHandler,
};
