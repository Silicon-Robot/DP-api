const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Personnel = require('../models/personnel.model');


const resetPassword = (req, res) => {
  
  const { email, password } = req.body;

  Personnel.findOne({email})
  .then(user => { 
    if (!user) return res.status(404).json('user not found');

    const hash = bcrypt.hashSync(password,10);

    user.hash = hash;

    user.save()
    .then(user=>{
      let token = jwt.sign({ user: user }, process.env.JWT_KEY, { expiresIn: 86400 })

      res.status(200).json({ auth: true, token: token })
    })
    .catch(err => res.status(500).json({ error: err }))
  })
  .catch(err => res.status(404).json({error: err}))
};

module.exports = resetPassword;

