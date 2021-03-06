const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Personnel = require('../models/personnel.model')
const Etudiant = require('../models/etudiant.model')


const signUp = (req, res) => {

  const { matricule, email, prenom, nom, startDate, tel, role, password } = req.body;
  console.log(req.body)
  bcrypt.hash(password, 10)
  .then(hash => {
    if(req.body.idClasse){
      var User = new Etudiant({
        hash,
        matricule,
        email,
        nom,
        prenom,
        tel,
        startDate,
        idClasse: req.body.idClasse,
        role
      })
    }
    else{
      var User = new Personnel({
        hash,
        matricule,
        email,
        nom,
        prenom,
        tel,
        startDate,
        role
      })
    }
    User.save()
    .then(user => {
      if(!user) {
       return res.status(404).json({error: "User not created"});
      }
      let token = jwt.sign({ user: user }, process.env.JWT_KEY, {
        expiresIn: 86400
      });
      res.status(200).json({ message: {auth: true, token: token }})
      })
    .catch(err => res.status(500).json({ error: 1+err.message }))
  })
  .catch(err => res.status(500).json({ error: 2+err.message }))
}

module.exports = signUp;