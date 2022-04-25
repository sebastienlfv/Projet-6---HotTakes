const Sauce = require('../models/Sauce')

exports.getSauces = (req, res, next) => {
    Sauce.find().then(sauce => {
        res.status(200).json(sauce)
    }).catch((error) => {
        res.status(400).json({ error: error })
    })
};
