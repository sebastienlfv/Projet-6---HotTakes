const express = require('express');
const saucesCtrl = require('../controllers/sauce')
const router = express.Router()
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

router.get('/', auth, saucesCtrl.getSauces)
router.post('/', auth,  multer, saucesCtrl.createSauce)
router.put('/:id', auth, multer, saucesCtrl.modifySauce)
router.delete('/:id', auth, saucesCtrl.deleteSauce)
router.get('/:id', auth, saucesCtrl.getOneSauce)
router.post('/:id/like', auth, saucesCtrl.likeSauce)

module.exports = router;