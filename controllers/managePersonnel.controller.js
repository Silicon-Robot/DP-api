const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const Transaction = require("mongoose-transactions");
const transaction = new Transaction();

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())


const Personnel = require('../models/personnel.model');
const Coordonnateur = require('../models/coordonnateur.model');
const Classe = require('../models/classe.model');
const Faculty = require('../models/faculty.model');


router.get('/', auth ,function (req, res) {
  console.log(req.role)
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  Personnel.find({})
      .then(users => {
        res.status(200).json({message:users});
      })
      .catch(err => res.status(500).json({ error: err.message }))
});

router.get('/users-classes-faculties', auth, async function (req, res) {
  console.log("passing here")
  if (req.role !== "secretaire") return res.status(502).json({ error: "auth failed" })
  const users = await Personnel.find()
  const classes = await Classe.find()
  const faculties = await Faculty.find()
  res.status(200).json({ message: { users, classes, faculties } })
});
router.post('/new', auth ,function (req, res) {
  console.log('passing here')
  if (req.role !== "secretaire") return res.status(502).json({ error: "auth failed" })

  const { matricule, email, prenom, nom, startDate, role, tel } = req.body;
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
      role
    })
    User.save()
        .then(user => {
          if(req.body.classes){
            const Coordo = new Coordonnateur({
              idPersonnel: user._id,
              classes: req.body.classes,
            })
            Coordo.save()
            .then(coordo=>(coordo)?console.log("Coordo created"):console.log("coordo not created"))
            .catch(err=>{
              Personnel.findByIdAndDelete(user._id)
              .then(data=>res.status(500).json({error: err + "+ personnel" + nom + " deleted"}))
            })
          }
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
              return res.status(400).json({ error: error })
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
  const { id } = req.params;
  const oldUser = await Personnel.findById(id)
  
  const oldCoordo = await Coordonnateur.findOne({idPersonnel:id});
  console.log(oldCoordo,oldUser)
  let { _id, matricule, nom, prenom, email, tel, startDate, role } = oldUser;
  oldUser.history.push({_id,matricule,nom,prenom,email,tel,startDate,role,changeDate: Date.now()})
   
  const start = async () => {
    try {
      let { matricule, nom, prenom, email, tel, role } = req.body;
      transaction.update("Personnel",id,{matricule,nom,prenom,email,tel,role,history: oldUser.history})
      if(oldCoordo & req.body.classes){
        let { _id, classes, horaire, startDate } = oldCoordo
        oldCoordo.history.push({_id,classes,horaire,startDate,changeDate: Date.now()})
        transaction.update("Coordonnateur",_id,{classes: req.body.classe, history:oldCoordo.history})
        console.log('Is a coordo')
      }
      const final = await transaction.run();
      res.status(200).json({ message: `Personnel was updated` })
    } catch (error) {
      console.error(error);
      await transaction.rollback().catch(console.error);
      transaction.clean();
      res.status(500).json({ error: error })
    }
  }

  start();
});

module.exports = router;