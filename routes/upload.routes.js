const express = require('express');
const uploadController = require('../controller/file.controller');
const { upload } = require('../middlewares/uploadMiddleware');


const router = express.Router();

router.post('/single', [upload.single('file')], uploadController.uploadSingle);
router.get('/:name', uploadController.getFile)

module.exports = router;
