const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const SauceObject = JSON.parse(req.body.sauce);
  delete SauceObject._id;
  const sauce = new Sauce({
    ...SauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
        })
      })
      .catch(error => res.status(500).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
}

exports.getSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};


exports.likeSauce = (req, res, next) => {
  let arrayLike = []
  let arrayDislike = []

  Sauce.findOne({ _id: req.params.id }, {}, (err, elemFromBase) => {
    usersLiked = elemFromBase.usersLiked;
    usersDisLiked = elemFromBase.usersDisLiked;
    switch(req.body.like){
      case 1:
        Sauce.updateOne({ _id: req.params.id }, {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          })
        .then(() => res.status(201).json({ message: 'Un like a été ajouté !'}))
        .catch(error => res.status(400).json({ error }));
        break;
      case 0:
        if(elemFromBase.usersLiked){
          Sauce.updateOne({ _id:req.params.id }, {
            $inc: {likes: 0},
            $push: {usersLiked: req.body.userId},
            _id: req.params.id
          })
          .then(() => res.status(201).json({ message: 'Un like a été enlevé !'}))
          .catch(error => res.status(400).json({ error }));
        } else if(elemFromBase.usersLiked){
          Sauce.updateOne({ _id:req.params.id }, {
            $inc: {dislikes: 0},
            $push: {usersDisLiked: req.body.userId},
            _id: req.params.id
          })
          .then(() => res.status(201).json({ message: 'Un dislike a été enlevé !'}))
          .catch(error => res.status(400).json({ error }));
        }
        break;
      case -1:
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
        })
      .then(() => res.status(201).json({ message: 'Un dislike a été ajouté !'}))
      .catch(error => res.status(400).json({ error }));
      break;
    }
    if (err) {
      console.log(err.message);
    };
  })
}
