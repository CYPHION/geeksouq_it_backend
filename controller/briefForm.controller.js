const asyncHandler = require("../utils/asyncHandler");
const briefFormServices = require("../services/briefForm.service")

exports.getBriefForm = asyncHandler(async (req, res, next) => {
    const data = await briefFormServices.getForms()
    return res.send({
        data,
    });
})

exports.createBriefForm = asyncHandler(async (req, res, next) => {
    const data = await briefFormServices.createForm(req.body)

    return res.send({
        data,
        message: 'Form Submitted',
    });
})

exports.deleteBriefForm = asyncHandler(async (req, res, next) => {
    await briefFormServices.deleteForms(req.params.id)
    return res.status(200).send({
        message: 'Form Delete Submitted'
    });
})
