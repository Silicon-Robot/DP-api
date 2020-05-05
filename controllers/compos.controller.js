const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');
// const Transaction = require("mongoose-transactions");
// const transaction = new Transaction();

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Cour = require('../models/cours.model');
const Etudiant = require('../models/etudiant.model');
const Personnel = require('../models/personnel.model');
const Evaluation = require('../models/evaluation.model');
const Classe = require('../models/classe.model');
const Copie = require('../models/copie.model');
const Note = require('../models/note.model');

router.get('/examen', auth, async function (req, res) {
  console.log("passing here")
  if (req.role !== "etudiant") return res.status(502).json({ error: "auth failed" })
  const students = await Etudiant.find()
  const classes = await Classe.find()
  const courses = await Cour.find()
  const evaluations = await Evaluation.find()
  const copies = await Copie.find()
  console.log(students,classes,courses,copies,evaluations)
  res.status(200).json({ message: { students, classes, courses, evaluations, copies } })
});
router.get('/notes-courses',auth, async (req,res)=>{
  if (req.role !== "etudiant") return res.status(502).json({ error: "auth failed" })
  const courses = await Cour.find()
  const notes = await Note.find()
  const users = await Personnel.find()
  console.log(courses,notes,users)
  res.status(200).json({ message: { notes, courses, users } })

})
router.post('/examen/new', auth , async (req,res)=>{
  if (req.role !== "etudiant") return res.status(502).json({ error: "auth failed" })
    console.log(req.body.copie)
  const Copy = new Copie({...req.body.copie})
  
  Copy.save()
    .then(copy=>copy._id? res.status(200).json({message: copy}):res.status(500).json({error: "could not save Copie"}))
    .catch(err=>res.status(500).json({error: err.message}))
})
router.put('/examen/:idCopie/update', auth , async (req,res)=>{
  if (req.role !== "etudiant") return res.status(502).json({ error: "auth failed" })
  let oldCopie = await Copie.findOne({_id: req.params.idCopie}).then(copy=>copy)
  if (!oldCopie) return res.status(500).json({error: "could not find Copie"})
  let { propositions, dateRemis } = oldCopie;

  oldCopie.history.push({ propositions, dateRemis })
  console.log(oldCopie)

  Copie.findByIdAndUpdate({ _id:req.params.idCopie }, {...req.body.copie, history: oldCopie.history}, { new: true })
    .then(copie => res.status(200).json({ message: copie }))
    .catch(error => res.status(500).json({ error: error.message }))
})
module.exports = router;