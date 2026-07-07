/**
 * Brief form controller.
 *
 * HTTP request handlers for the /api/v1/brief-form endpoints. Handlers stay
 * thin: they delegate data work (and the notification email) to
 * services/briefForm.service.js and shape the response. Every handler is
 * wrapped in asyncHandler so thrown errors reach the global error handler.
 */
const asyncHandler = require("../utils/asyncHandler");
const briefFormServices = require("../services/briefForm.service")

/**
 * GET /api/v1/brief-form/all
 * Returns all brief form submissions.
 */
exports.getBriefForm = asyncHandler(async (req, res, next) => {
    const data = await briefFormServices.getForms()
    return res.send({
        data,
    });
})

/**
 * POST /api/v1/brief-form/create
 * Saves a brief form submission (questionnaire answers stored as JSON in
 * `formData`) and emails a notification with links to any uploaded files.
 */
exports.createBriefForm = asyncHandler(async (req, res, next) => {
    const data = await briefFormServices.createForm(req.body)

    return res.send({
        data,
        message: 'Form Submitted',
    });
})

/**
 * DELETE /api/v1/brief-form/delete/:id
 * Deletes a brief form submission by id.
 */
exports.deleteBriefForm = asyncHandler(async (req, res, next) => {
    await briefFormServices.deleteForms(req.params.id)
    return res.status(200).send({
        message: 'Form Delete Submitted'
    });
})
