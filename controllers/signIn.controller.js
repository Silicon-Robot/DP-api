const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// const config = require('../.env');

const Personnel = require('../models/personnel.model');

const signIn = (req,res) => {

  const { email, password } = req.body;

  Personnel.findOne({ email })
  .then(user => {
    let passwordIsValid = bcrypt.compareSync(password, user.hash);

    if (!passwordIsValid) return res.status(401).json({ auth: false, token: null });

    let token = jwt.sign({ user: user }, process.env.JWT_KEY, {
      expiresIn: 86400
    });

    res.status(200).json({ auth: true, token: token });
  })
  .catch(err => res.status(500).json({ error: err }))

};

module.exports = signIn;