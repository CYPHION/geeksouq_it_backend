/**
 * File controller.
 *
 * HTTP request handlers for the /api/v1/upload endpoints. Files are written
 * to disk by the multer middleware (middlewares/uploadMiddleware.js) before
 * these handlers run — `uploadSingle` only reports the stored file name back
 * to the client.
 */
const asyncHandler = require("../utils/asyncHandler");
const fs = require('fs');
const { getImagePath } = require("../utils/function");


/**
 * POST /api/v1/upload/single
 * Responds with the name multer stored the uploaded file under. The client
 * keeps this name to reference the file later (e.g. brief form images).
 */
exports.uploadSingle = asyncHandler(async (req, res, next) => {
    return res.send({
        data: req.file.filename,
        message: 'file uploaded successfully',
    });
})


/**
 * GET /api/v1/upload/:name
 * Streams a previously uploaded file from the uploads/ directory by its
 * stored name. Responds 404 if no such file exists on disk.
 */
exports.getFile = asyncHandler(async (req, res, next) => {
    const imageName = req.params.name;
    const imagePath = getImagePath(imageName);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
})
