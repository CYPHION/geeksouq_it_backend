/**
 * Newsletter routes — mounted at /api/v1/newsletter.
 *
 * CRUD endpoints for newsletter email subscriptions.
 * The `@swagger` blocks below are parsed by swagger-jsdoc (see config/swagger.js)
 * to generate the interactive docs at /api-docs.
 */
const express = require('express');
const newsletterController = require('../controller/newsletter.controller');

const router = express.Router();


/**
 * @swagger
 * /api/v1/newsletter/all:
 *   get:
 *     summary: Get all newsletter subscriptions
 *     tags: [Newsletter]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter subscriptions by email
 *     responses:
 *       200:
 *         description: List of newsletter subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Newsletter'
 *                 message:
 *                   type: string
 *                   example: ''
 */
router.get('/all', newsletterController.getAllNewsletter);

/**
 * @swagger
 * /api/v1/newsletter/create:
 *   post:
 *     summary: Subscribe to the newsletter (sends a welcome email)
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Subscribed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Newsletter'
 *                 message:
 *                   type: string
 *                   example: Thank You for Subscribe !
 */
router.post('/create', newsletterController.createNewsletter);

/**
 * @swagger
 * /api/v1/newsletter/update:
 *   put:
 *     summary: Update a newsletter subscription
 *     tags: [Newsletter]
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
 *               email:
 *                 type: string
 *                 format: email
 *               subscribe:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Newsletter updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Newsletter'
 *                 message:
 *                   type: string
 *                   example: Newsletter updated successfully
 *       404:
 *         description: Newsletter not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/update', newsletterController.updateNewsletter);

/**
 * @swagger
 * /api/v1/newsletter/delete/{id}:
 *   delete:
 *     summary: Delete a newsletter subscription
 *     tags: [Newsletter]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter id
 *     responses:
 *       200:
 *         description: Newsletter deleted successfully
 *       404:
 *         description: Newsletter not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/delete/:id', newsletterController.deleteNewsletter);

module.exports = router;
