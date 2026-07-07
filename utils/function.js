/**
 * Shared helper functions.
 */
const path = require("path");
const { uploadDirectory } = require("./directory");

/**
 * Prepares a query-string object for use as a Sequelize `where` filter.
 * Query params always arrive as strings, so any value that looks like a
 * JSON array (contains '[') is parsed back into a real array — e.g.
 * ?id=[1,2] becomes { id: [1, 2] }, which Sequelize treats as an IN clause.
 *
 * @param {object} obj - Raw query params (req.query).
 * @returns {object} a new object with array-like string values parsed
 */
exports.modifyingPayload = (obj) => {

    let newObj = {}

    Object.keys(obj).forEach(elem => {
        const value = obj[elem]
        newObj[elem] = (typeof value === 'string' && value?.includes('[')) ? JSON.parse(value) : value
    })

    return newObj
}

/**
 * Resolves the on-disk path of an uploaded file from its stored name.
 * @param {string} image - File name as returned by the upload endpoint.
 * @returns {string} path inside the uploads/ directory
 */
exports.getImagePath = (image) => {
    return path.join(uploadDirectory, image)
}
