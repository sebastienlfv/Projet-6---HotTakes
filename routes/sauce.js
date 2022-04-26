const express = require('express');
const saucesCtrl = require('../controllers/sauce')
const router = express.Router()

router.get('/', saucesCtrl.getSauces)
router.post('/', saucesCtrl.createSauce)

module.exports = router;