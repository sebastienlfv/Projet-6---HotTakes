const express = require('express');
const saucesCtrl = require('../controllers/sauce')
const router = express.Router()

router.post('/', saucesCtrl.createSauce)
router.get('/', saucesCtrl.getSauces)

module.exports = router;