/**
 * File upload middleware (multer).
 *
 * Configures how multipart/form-data uploads are stored: files go straight
 * to disk in the uploads/ directory, renamed to a timestamp so names never
 * collide. Used by routes/upload.routes.js as `upload.single('file')`.
 */
const multer = require("multer");

// disk storage configuration for saving files directly to server storage
var storage = multer.diskStorage({
    // store every upload in the 'uploads' folder (also served statically at /uploads)
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // rename the file to the current timestamp, keeping the original extension,
    // e.g. "photo.png" → "1720350000000.png" — this name is returned to the client
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname.split('.')[1]);
    }
});

// multer instance with disk storage and a ~100 MB size limit
exports.upload = multer({
    storage: storage,
    limits: 100000000
});
