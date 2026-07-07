const express = require('express');
const briefFormController = require('../controller/briefForm.controller');

const router = express.Router();


//Student Year Route

router.get('/all', briefFormController.getBriefForm);
router.post('/create', briefFormController.createBriefForm);
router.delete('/delete/:id', briefFormController.deleteBriefForm);

module.exports = router;