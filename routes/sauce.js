const express = require('express');
const saucesCtrl = require('../controllers/sauce')
const router = express.Router()

router.get('/', saucesCtrl.getSauces)

module.exports = router;