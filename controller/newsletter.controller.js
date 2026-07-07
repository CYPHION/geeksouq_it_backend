/**
 * Newsletter controller.
 *
 * HTTP request handlers for the /api/v1/newsletter endpoints. Handlers stay
 * thin: they delegate data work to services/newsletter.service.js and shape
 * the response. Every handler is wrapped in asyncHandler so thrown errors
 * reach the global error handler middleware.
 */
const asyncHandler = require("../utils/asyncHandler");
const { newsLetterServices } = require('../services');
const { generateEmail } = require("../utils/email");
const { newsletterEmailContent } = require("../utils/constant");

// #region Newsletter

/**
 * POST /api/v1/newsletter/create
 * Subscribes an email address to the newsletter and sends the subscriber
 * a welcome email (template in utils/constant.js).
 */
exports.createNewsletter = asyncHandler(async (req, res) => {
    const data = await newsLetterServices.createNewsletter(req.body)

    await generateEmail(req.body.email, 'Welcome to GeekSouq Newsletter!',"", newsletterEmailContent)
    return res.send({
        data,
        message: 'Thank You for Subscribe !',
    });
})

/**
 * GET /api/v1/newsletter/all
 * Returns all newsletter subscriptions. Query-string params are passed
 * through as a Sequelize `where` filter (e.g. ?subscribe=true).
 */
exports.getAllNewsletter = asyncHandler(async (req, res) => {
    const data = await newsLetterServices.getAllNewsletter(req.query)

    return res.send({
        data,
        message: '',
    });
});


/**
 * PUT /api/v1/newsletter/update
 * Updates a subscription (e.g. toggle `subscribe` on/off). Expects the
 * record `id` plus the changed fields in the request body.
 * Responds 404 if the subscription doesn't exist.
 */
exports.updateNewsletter = asyncHandler(async (req, res, next) => {
    const data = await newsLetterServices.updateNewsletter(req.body.id, req.body)

    return res.send({
        data,
        message: 'Newsletter updated successfully',
    });
})

/**
 * DELETE /api/v1/newsletter/delete/:id
 * Deletes a subscription by id. Responds 404 if it doesn't exist.
 */
exports.deleteNewsletter = asyncHandler(async (req, res, next) => {
    const data = await newsLetterServices.deleteNewsletter(req.params.id)

    return res.send({
        data,
        message: 'Newsletter deleted successfully',
    });
})

// #endregion