/**
 * Service layer barrel file.
 *
 * Re-exports every service so consumers can import them from one place:
 *   const { formServices } = require('../services');
 */
const formServices = require('./form.service')
const newsLetterServices = require('./newsletter.service')
const briefFormServices = require('./briefForm.service')

module.exports = {
    formServices,
    newsLetterServices,
    briefFormServices
}
