const Sauce = require('../models/Sauce')

exports.getSauces = (req, res, next) => {
    Sauce.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error: error }))
};