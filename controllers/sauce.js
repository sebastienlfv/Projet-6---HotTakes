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
    const like = req.body.like
    const userId = req.body.userId
    const sauceId = req.params.id
  
    switch(like){
      case 1:
        Sauce.updateOne({ _id: sauceId }, {
            $inc: { likes: +1 },
            $push: { usersLiked: userId },
          })
        .then(() => res.status(201).json({ message: 'Un like a été ajouté !'}))
        .catch(error => res.status(400).json({ error }));
        break;
      case 0:
        if(elemFromBase.usersLiked){
          Sauce.updateOne({ _id:req.params.id }, {
            $inc: {likes: -1},
            $push: {usersLiked: userId},
          })
          .then(() => res.status(200).json({ message: 'Un like a été enlevé !'}))
          .catch(error => res.status(400).json({ error }));
        } 
        break;
      case -1:
        Sauce.updateOne({ _id: sauceId }, {
          $push: { usersDisliked: userId },
          $inc: { dislikes: +1 }
        })
        .then(() => res.status(201).json({ message: 'Un dislike a été ajouté !'}))
        .catch(error => res.status(400).json({ error }));
        break;
      default:
        console.log(error)
    }
    if (err) {
      console.log(err.message);
    };
  })
}
