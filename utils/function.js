const path = require("path");
const { uploadDirectory } = require("./directory");

exports.modifyingPayload = (obj) => {

    let newObj = {}

    Object.keys(obj).forEach(elem => {
        const value = obj[elem]
        newObj[elem] = (typeof value === 'string' && value?.includes('[')) ? JSON.parse(value) : value
    })

    return newObj
}

exports.getImagePath = (image) => {
    // Joins the upload directory path with the image file name to create a full path
    return path.join(uploadDirectory, image)
}