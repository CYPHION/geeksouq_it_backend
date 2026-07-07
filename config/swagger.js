/**
 * Swagger / OpenAPI specification.
 *
 * Builds the OpenAPI 3 document served at /api-docs (non-production only).
 * The base definition (info, tags, reusable schemas) lives here; the
 * per-endpoint documentation is written as JSDoc `@swagger` comments inside
 * the files matched by `apis` below (routes/*.js).
 */
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./config');
const { version } = require('../package.json');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'GeekSouq Backend API',
            version,
            description: 'API documentation for the GeekSouq backend. API endpoints are versioned under `/api/v1`.',
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
                description: 'Local server',
            },
        ],
        tags: [
            { name: 'System', description: 'Backend info and health endpoints' },
            { name: 'Form', description: 'Contact / package / schedule form endpoints' },
            { name: 'Newsletter', description: 'Newsletter subscription endpoints' },
            { name: 'BriefForm', description: 'Brief form endpoints' },
            { name: 'Upload', description: 'File upload endpoints' },
        ],
        components: {
            // reusable response schemas, referenced from route annotations
            // via $ref: '#/components/schemas/<Name>'
            schemas: {
                Form: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        phoneNo: { type: 'string', example: '+1234567890' },
                        message: { type: 'string', example: 'I am interested in the premium package.' },
                        scheduleDate: { type: 'string', format: 'date', nullable: true, example: '2026-07-15' },
                        isChat: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Newsletter: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        subscribe: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                BriefForm: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        type: { type: 'string', example: 'logo-design' },
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        formData: { type: 'object', example: { question1: 'answer1' } },
                        formImage: { type: 'string', nullable: true, example: 'file-123456.png' },
                        userImage: { type: 'string', nullable: true, example: 'file-654321.png' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Not found' },
                    },
                },
            },
        },
    },
    // files scanned for @swagger JSDoc annotations
    apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
