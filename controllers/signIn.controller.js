const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Personnel = require('../models/personnel.model');
const Etudiant = require('../models/etudiant.model');

const signIn = (req,res) => {

  const { email, password } = req.body;

  Personnel.findOne({ email })
  .then(async user => {
    if(!user) {
      user = await Etudiant.findOne({email}).then(user=>user)
      console.log(user)
      if (!user) {
        return res.status(404).json({error: "User not found"});  
      }
    }
    let passwordIsValid = bcrypt.compareSync(password, user.hash);

    if (!passwordIsValid) return res.status(401).json({ error: {auth: false, token: null }});

    let token = jwt.sign({ user: user }, process.env.JWT_KEY, {
      expiresIn: 86400
    });
    console.log("signin",token)
    res.status(200).json({ message: {auth: true, token: token }})
  })
  .catch(err => res.status(500).json({ error: err.message }))

};

module.exports = signIn;