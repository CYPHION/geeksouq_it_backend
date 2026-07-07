const asyncHandler = require("../utils/asyncHandler");
const fs = require('fs');
const { getImagePath } = require("../utils/function");


exports.uploadSingle = asyncHandler(async (req, res, next) => {
    return res.send({
        data: req.file.filename,
        message: 'file uploaded successfully',
    });
})


exports.getFile = asyncHandler(async (req, res, next) => {
    const imageName = req.params.name;
    const imagePath = getImagePath(imageName);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
})