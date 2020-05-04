const jwt = require('jsonwebtoken');

const Personnel = require('../models/personnel.model');
const Etudiant = require('../models/etudiant.model');

const signInToken = (req, res) => {

  const { token } = req.body;
    console.log(token)
  try {
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided' });

    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    console.log(decoded,err)
      if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token' });
      let userId = decoded.user._id;
      Personnel.findById(userId)
        .then(async user => {
          if(!user) {
            let user = await Etudiant.findById(userId).then(user=>user)
            if (!user) {
              return res.status(404).json({error: "User not found"});  
            }
          }
          console.log("hello",user)
          let token = jwt.sign({ user: user }, process.env.JWT_KEY, {
            expiresIn: 86400
          });
          res.status(200).json({ message: { auth: true, token: token } })
        })
        .catch(err => res.status(500).json({ error: err.message }))
      });
    } catch (error) {
    return res.status(500).json({ error: error })
  }
}
module.exports = signInToken;