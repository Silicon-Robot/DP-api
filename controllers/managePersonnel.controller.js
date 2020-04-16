const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Personnel = require('../models/personnel.model');


router.get('/', auth ,function (req, res) {
  console.log(req.role)
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  Personnel.find({})
      .then(users => {
        res.status(200).json({message:users});
      })
      .catch(err => res.status(500).json({ error: err.message }))
});

router.post('/new', auth ,function (req, res) {
  console.log('passing here')
  if (req.role !== "secretaire") return res.status(502).json({ error: "auth failed" })

  const { matricule, email, prenom, nom, startDate, nomRole, tel } = req.body;
  console.log(req.body)
  bcrypt.hash("password1231", 10)
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
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
            }
          });
          console.log(user)
          const mailOptions = {
            from: `"eSchool Learning "<${process.env.EMAIL}>`,
            to: email,
            subject: 'Your Password',
            html: `<div style="width: 100vw;height: 100vh;display: flex;flex-direction: column;align-items: center;justify-content: center;">
            <h1 style="font-weight: 300;">Password</h1>
            <br/>
            <span><b>${"password1231"}</b></span>
            <br/>
            <span><i>Please don't to change your default password when signed in</i></span>
          </div>`
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              res.status(400).json({ error: error })
            } else {
              console.log('Email sent: ' + info.response);
              console.log({ message: "password sent" })
              return res.status(200).json({ message: user})
            }
          });
        })
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.get('/:id', auth ,function (req, res) {
  if (req.role !== "secretaire") return res.status(502).json({ error: "auth failed" })

  Personnel.findById(req.params.id)
      .then(user => {
        res.status(200).json({message:user});
      })
      .catch(err => res.status(500).json({ error: err.message }) )
});

router.delete('/:id/delete', auth ,function (req, res) {
  if (req.role !== "secretaire") return res.status(502).json({ error: "auth failed" })

  Personnel.findByIdAndRemove(req.params.id)
      .then(user => {
        res.status(200).json({ message: `User ${user.nom} was deleted`});
      })
      .catch(err => res.status(500).json({ error: err.message }))
});

router.put('/:id/update', auth ,async (req, res) => {
  if (req.role !== "secretaire") return res.status(502).json({ error: "auth failed" })

  const { id } = req.body;
  const oldUser = await Personnel.findById(id);
  oldUser.history.push({_id,matricule,nom,prenom,email,tel,startDate,role,changeDate: Date.now()})

  Personnel.findOneAndUpdate({id}, {...req.body, history: oldUser.history }, { new: true }) 
      .then(user => {
        res.status(200).json({message: `User ${user.nom} was updated`});
      })
      .catch(err => res.status(500).json({ error: err.message }))
});

module.exports = router;