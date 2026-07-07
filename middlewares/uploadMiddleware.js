// Import multer module for file handling
const multer = require("multer");

// Disk storage configuration for saving files directly to server storage
var storage = multer.diskStorage({
    // Function to specify the destination where the file should be stored
    destination: function (req, file, cb) {
        // Set the destination to 'uploads' folder
        cb(null, 'uploads');
    },
    // Function to specify the naming convention of the uploaded files
    filename: function (req, file, cb) {
        // Create the file name with a timestamp and preserve the original file extension
        cb(null, Date.now() + '.' + file.originalname.split('.')[1]);
    }
});

// Set up multer with disk storage and a file size limit
exports.upload = multer({
    storage: storage,
    limits: 100000000
});