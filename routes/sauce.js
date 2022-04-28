const express = require('express');
const saucesCtrl = require('../controllers/sauce')
const router = express.Router()
const multer = require('../middleware/multer-config')

router.get('/', saucesCtrl.getSauces)
router.post('/', multer, saucesCtrl.createSauce)
router.put('/:id', multer, saucesCtrl.modifySauce)
router.delete('/:id', saucesCtrl.deleteSauce)
router.get('/:id', saucesCtrl.getOneSauce)

module.exports = router;