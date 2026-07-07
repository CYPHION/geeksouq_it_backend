/**
 * Contact form routes — mounted at /api/v1/form.
 *
 * CRUD endpoints for contact/package/schedule form submissions.
 * The `@swagger` blocks below are parsed by swagger-jsdoc (see config/swagger.js)
 * to generate the interactive docs at /api-docs.
 */
const express = require('express');
const formController = require('../controller/form.controller');

const router = express.Router();


/**
 * @swagger
 * /api/v1/form/all:
 *   get:
 *     summary: Get all forms
 *     tags: [Form]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter forms by email
 *     responses:
 *       200:
 *         description: List of forms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Form'
 *                 message:
 *                   type: string
 *                   example: ''
 */
router.get('/all', formController.getAllform);

/**
 * @swagger
 * /api/v1/form/create:
 *   post:
 *     summary: Create a form (sends a notification email)
 *     tags: [Form]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phoneNo:
 *                 type: string
 *                 example: '+1234567890'
 *               message:
 *                 type: string
 *                 example: I am interested in the premium package.
 *               scheduleDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-07-15'
 *               isChat:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Form created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Form'
 *                 message:
 *                   type: string
 *                   example: Form created successfully
 */
router.post('/create', formController.createform);

/**
 * @swagger
 * /api/v1/form/update:
 *   put:
 *     summary: Update a form
 *     tags: [Form]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNo:
 *                 type: string
 *               message:
 *                 type: string
 *               scheduleDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Form updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Form'
 *                 message:
 *                   type: string
 *                   example: Form updated successfully
 *       404:
 *         description: Form not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/update', formController.updateform);

/**
 * @swagger
 * /api/v1/form/delete/{id}:
 *   delete:
 *     summary: Delete a form
 *     tags: [Form]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Form id
 *     responses:
 *       200:
 *         description: Form deleted successfully
 *       404:
 *         description: Form not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/delete/:id', formController.deleteform);

module.exports = router;
