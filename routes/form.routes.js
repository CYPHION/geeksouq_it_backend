const express = require('express');
const formController = require('../controller/form.controller');

const router = express.Router();


//Student Year Route

router.get('/all', formController.getAllform);
router.post('/create', formController.createform);
router.put('/update', formController.updateform);
router.delete('/delete/:id', formController.deleteform);

module.exports = router;