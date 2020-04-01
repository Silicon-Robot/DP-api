const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

// let config = require('../.env');

let Personnel = require('../models/personnel.model');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/signin', function (req, res) {

  const { email, password } = req.body;

  Personnel.findOne({ email: email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    let passwordIsValid = bcrypt.compareSync(password, user.hash);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    let token = jwt.sign({ id: user._id }, "SecretKey", {
      expiresIn: 86400
    });

    res.status(200).send({ auth: true, token: token });
  });

});