/**
 * Brief form routes — mounted at /api/v1/brief-form.
 *
 * Endpoints for project brief submissions (dynamic questionnaire data
 * stored as JSON, with optional uploaded images).
 * The `@swagger` blocks below are parsed by swagger-jsdoc (see config/swagger.js)
 * to generate the interactive docs at /api-docs.
 */
const express = require('express');
const briefFormController = require('../controller/briefForm.controller');

const router = express.Router();


/**
 * @swagger
 * /api/v1/brief-form/all:
 *   get:
 *     summary: Get all brief forms
 *     tags: [BriefForm]
 *     responses:
 *       200:
 *         description: List of brief forms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BriefForm'
 */
router.get('/all', briefFormController.getBriefForm);

/**
 * @swagger
 * /api/v1/brief-form/create:
 *   post:
 *     summary: Submit a brief form
 *     tags: [BriefForm]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, username, email, formData]
 *             properties:
 *               type:
 *                 type: string
 *                 example: logo-design
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               formData:
 *                 type: object
 *                 example: { question1: answer1 }
 *               formImage:
 *                 type: string
 *                 example: file-123456.png
 *               userImage:
 *                 type: string
 *                 example: file-654321.png
 *     responses:
 *       200:
 *         description: Form submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/BriefForm'
 *                 message:
 *                   type: string
 *                   example: Form Submitted
 */
router.post('/create', briefFormController.createBriefForm);

/**
 * @swagger
 * /api/v1/brief-form/delete/{id}:
 *   delete:
 *     summary: Delete a brief form
 *     tags: [BriefForm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brief form id
 *     responses:
 *       200:
 *         description: Form deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Form Delete Submitted
 */
router.delete('/delete/:id', briefFormController.deleteBriefForm);

module.exports = router;
