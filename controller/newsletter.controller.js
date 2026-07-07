const asyncHandler = require("../utils/asyncHandler");
const { newsLetterServices } = require('../services');
const { generateEmail } = require("../utils/email");
const { newsletterEmailContent } = require("../utils/constant");

// #region Newsletter
exports.createNewsletter = asyncHandler(async (req, res) => {
    const data = await newsLetterServices.createNewsletter(req.body)

    await generateEmail(req.body.email, 'Welcome to GeekSouq Newsletter!',"", newsletterEmailContent)
    return res.send({
        data,
        message: 'Thank You for Subscribe !',
    });
})

exports.getAllNewsletter = asyncHandler(async (req, res) => {
    const data = await newsLetterServices.getAllNewsletter(req.query)

    return res.send({
        data,
        message: '',
    });
});


exports.updateNewsletter = asyncHandler(async (req, res, next) => {
    const data = await newsLetterServices.updateNewsletter(req.body.id, req.body)

    return res.send({
        data,
        message: 'Newsletter updated successfully',
    });
})

exports.deleteNewsletter = asyncHandler(async (req, res, next) => {
    const data = await newsLetterServices.deleteNewsletter(req.params.id)

    return res.send({
        data,
        message: 'Newsletter deleted successfully',
    });
})

// #endregion