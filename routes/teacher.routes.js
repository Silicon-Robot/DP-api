const express = require('express')
const router = express.Router();

const auth = require('../middlewares/auth');

const Timetable = require('../models/timetable.model');
const Classe = require('../models/classe.model');
const Personnel = require('../models/personnel.model');
const Cour = require('../models/cours.model');

const questionnaire = require('../controllers/questionnaire.controller')

router.use('/questionnaire',questionnaire)

router.get('/timetable', auth, async (req,res)=>{
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
  let id = req.userId;
  const timetables = await Timetable.find()
  const users = await Personnel.findById(id).then(user=>user)
  const classes =  await Classe.find()
  const cours =  await Cour.find({idEnseignant: id})
  let Cclasses = new Set()
  cours.map(cour=>{
    cour.classes.map(Aclass=>Cclasses.add(Aclass))
  })
  let tempClasses = []
  Cclasses.forEach(i=>{
    let classeFound = classes.find(classe =>classe._id == i)
    tempClasses.push(classeFound)
  })
  tempClasses = tempClasses.map(classe=>{
    return {idClasse: classe._id, nomClasse: classe.nomClasse+" "+classe.niveau}
  })
  let teacher = { _id: users._id, matricule: users.matricule, email: users.email, nom: users.nom, prenom: users.prenom, tel: users.tel, role: users.role, taughtClasses: tempClasses};

  res.status(200).json({ message: { timetables, teacher:[teacher] } })

})

module.exports = router;