const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Personnel = require('../models/personnel.model')


const signUp = (req, res) => {

  const { matricule, email, prenom, nom, startDate, nomRole, tel, password } = req.body;

  bcrypt.hash(password, 10)
  .then(hash => {
    const User = new Personnel({
      hash,
      matricule,
      email,
      nom,
      prenom,
      tel,
      startDate,
      role: {
        nomRole,
        startDate
      }
    })
    User.save()
    .then(user => {
      let token = jwt.sign({ user: user},process.env.JWT_KEY, { expiresIn: 86400 })
      res.status(200).json({ auth: true, token: token })
    })
    .catch(err => res.status(500).json({ error: err.message }))
  })
  .catch(err => res.status(500).json({ error: err.message }))
}

module.exports = signUp;