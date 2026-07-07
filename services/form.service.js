/**
 * Contact form service.
 *
 * Business logic and database access for contact form submissions.
 * Controllers call these functions; all database work goes through the
 * Sequelize `Form` model so no SQL lives in the controllers.
 */
const Form = require("../model/form.model");
const ErrorResponse = require("../utils/errorResponse");
const { modifyingPayload } = require("../utils/function");

// #region Form

/**
 * Returns all forms matching the given filter.
 * @param {object} filter - Sequelize `where` conditions (usually req.query);
 *   stringified arrays in values are parsed first via modifyingPayload.
 * @returns {Promise<Form[]>}
 */
exports.getAllForm = async (filter = {}) => {
    filter = modifyingPayload(filter)
    return Form.findAll({ where: filter });
}

/**
 * Returns a single form by primary key, or null if not found.
 * @param {number} id
 * @returns {Promise<Form|null>}
 */
exports.getFormById = async (id) => {
    return Form.findByPk(id);
}

/**
 * Creates a new form record.
 * @param {object} obj - Form fields (name, email, phoneNo, message, scheduleDate).
 * @returns {Promise<Form>} the created record
 */
exports.createForm = async (obj) => {
    return await Form.create(obj);
}

/**
 * Updates an existing form.
 * @param {number} id - Id of the form to update.
 * @param {object} body - Fields to change.
 * @returns {Promise<Form>} the updated record
 * @throws {ErrorResponse} 404 if no form exists with the given id
 */
exports.updateForm = async (id, body) => {
    const data = await Form.findByPk(id);

    if (!data) {
        throw new ErrorResponse('Form not found', 404);
    }

    return await data.update(body);
}

/**
 * Deletes a form by id.
 * @param {number} id
 * @returns {Promise<Form>} the destroyed record
 * @throws {ErrorResponse} 404 if no form exists with the given id
 */
exports.deleteForm = async (id) => {
    const job = await Form.findByPk(id);

    if (!job) {
        throw new ErrorResponse('Form not found', 404)
    }


    return await job.destroy();
}

// #endregion
