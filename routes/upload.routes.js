/**
 * File upload routes — mounted at /api/v1/upload.
 *
 * Uploading goes through the multer middleware (multipart/form-data, field
 * name `file`); files are stored on disk in the uploads/ directory.
 * The `@swagger` blocks below are parsed by swagger-jsdoc (see config/swagger.js)
 * to generate the interactive docs at /api-docs.
 */
const express = require('express');
const uploadController = require('../controller/file.controller');
const { upload } = require('../middlewares/uploadMiddleware');


const router = express.Router();

/**
 * @swagger
 * /api/v1/upload/single:
 *   post:
 *     summary: Upload a single file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: Stored file name
 *                   example: file-123456.png
 *                 message:
 *                   type: string
 *                   example: file uploaded successfully
 */
router.post('/single', [upload.single('file')], uploadController.uploadSingle);

/**
 * @swagger
 * /api/v1/upload/{name}:
 *   get:
 *     summary: Get an uploaded file by name
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: File name returned by the upload endpoint
 *     responses:
 *       200:
 *         description: The file
 *       404:
 *         description: Image not found
 */
router.get('/:name', uploadController.getFile)

module.exports = router;
