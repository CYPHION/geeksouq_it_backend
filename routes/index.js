/**
 * API v1 root router.
 *
 * Aggregates every feature router under its base path. Mounted at /api/v1
 * in index.js, so e.g. form routes are reachable at /api/v1/form/...
 */
const express = require('express');
const formRoute = require('./form.routes')
const newsLetterRoute = require('./newsletter.routes')
const briefFromRoute = require('./briefForm.routes')
const uploadsRoute = require('./upload.routes')

const router = express.Router();

router.use('/form', formRoute)
router.use('/newsletter', newsLetterRoute)
router.use('/brief-form', briefFromRoute)
router.use('/upload', uploadsRoute)


module.exports = router
