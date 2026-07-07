
const Newsletter = require("../model/newsletter.model");
const ErrorResponse = require("../utils/errorResponse");
const { modifyingPayload } = require("../utils/function");

// #region Newsletter

exports.getAllNewsletter = async (filter = {}) => {
    filter = modifyingPayload(filter)
    return Newsletter.findAll({ where: filter });
}

exports.getNewsletterById = async (id) => {
    return Newsletter.findByPk(id);
}

exports.createNewsletter = async (obj) => {
    return await Newsletter.create(obj);
}

exports.updateNewsletter = async (id, body) => {
    const data = await Newsletter.findByPk(id);

    if (!data) {
        throw new ErrorResponse('Newsletter not found', 404);
    }

    return await data.update(body);
}

exports.deleteNewsletter = async (id) => {
    const job = await Newsletter.findByPk(id);

    if (!job) {
        throw new ErrorResponse('Newsletter not found', 404)
    }


    return await job.destroy();
}

// #endregion