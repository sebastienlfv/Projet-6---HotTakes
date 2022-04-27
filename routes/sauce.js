const express = require('express');
const saucesCtrl = require('../controllers/sauce')
const router = express.Router()

router.post('/', saucesCtrl.createSauce)
router.put('/:id', saucesCtrl.modifySauce)
router.delete('/:id', saucesCtrl.deleteSauce)
router.get('/:id', saucesCtrl.getOneSauce)
router.get('/', saucesCtrl.getSauces)

module.exports = router;