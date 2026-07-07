/**
 * Newsletter service.
 *
 * Business logic and database access for newsletter subscriptions.
 * Controllers call these functions; all database work goes through the
 * Sequelize `Newsletter` model so no SQL lives in the controllers.
 */
const Newsletter = require("../model/newsletter.model");
const ErrorResponse = require("../utils/errorResponse");
const { modifyingPayload } = require("../utils/function");

// #region Newsletter

/**
 * Returns all subscriptions matching the given filter.
 * @param {object} filter - Sequelize `where` conditions (usually req.query);
 *   stringified arrays in values are parsed first via modifyingPayload.
 * @returns {Promise<Newsletter[]>}
 */
exports.getAllNewsletter = async (filter = {}) => {
    filter = modifyingPayload(filter)
    return Newsletter.findAll({ where: filter });
}

/**
 * Returns a single subscription by primary key, or null if not found.
 * @param {number} id
 * @returns {Promise<Newsletter|null>}
 */
exports.getNewsletterById = async (id) => {
    return Newsletter.findByPk(id);
}

/**
 * Creates a new subscription record.
 * @param {object} obj - Subscription fields (email; `subscribe` defaults to true).
 * @returns {Promise<Newsletter>} the created record
 */
exports.createNewsletter = async (obj) => {
    return await Newsletter.create(obj);
}

/**
 * Updates an existing subscription (e.g. toggling `subscribe`).
 * @param {number} id - Id of the subscription to update.
 * @param {object} body - Fields to change.
 * @returns {Promise<Newsletter>} the updated record
 * @throws {ErrorResponse} 404 if no subscription exists with the given id
 */
exports.updateNewsletter = async (id, body) => {
    const data = await Newsletter.findByPk(id);

    if (!data) {
        throw new ErrorResponse('Newsletter not found', 404);
    }

    return await data.update(body);
}

/**
 * Deletes a subscription by id.
 * @param {number} id
 * @returns {Promise<Newsletter>} the destroyed record
 * @throws {ErrorResponse} 404 if no subscription exists with the given id
 */
exports.deleteNewsletter = async (id) => {
    const job = await Newsletter.findByPk(id);

    if (!job) {
        throw new ErrorResponse('Newsletter not found', 404)
    }


    return await job.destroy();
}

// #endregion
