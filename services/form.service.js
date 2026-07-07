
const Form = require("../model/form.model");
const ErrorResponse = require("../utils/errorResponse");
const { modifyingPayload } = require("../utils/function");

// #region Form

exports.getAllForm = async (filter = {}) => {
    filter = modifyingPayload(filter)
    return Form.findAll({ where: filter });
}

exports.getFormById = async (id) => {
    return Form.findByPk(id);
}

exports.createForm = async (obj) => {
    return await Form.create(obj);
}

exports.updateForm = async (id, body) => {
    const data = await Form.findByPk(id);

    if (!data) {
        throw new ErrorResponse('Form not found', 404);
    }

    return await data.update(body);
}

exports.deleteForm = async (id) => {
    const job = await Form.findByPk(id);

    if (!job) {
        throw new ErrorResponse('Form not found', 404)
    }


    return await job.destroy();
}

// #endregion