const express = require('express');
const newsletterController = require('../controller/newsletter.controller');

const router = express.Router();


//Student Year Route

router.get('/all', newsletterController.getAllNewsletter);
router.post('/create', newsletterController.createNewsletter);
router.put('/update', newsletterController.updateNewsletter);
router.delete('/delete/:id', newsletterController.deleteNewsletter);

module.exports = router;