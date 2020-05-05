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
const Evaluation = require('../models/evaluation.model');
const Classe = require('../models/classe.model');
const Copie = require('../models/copie.model');
const Note = require('../models/note.model');
const Personnel = require('../models/personnel.model');

router.get('/teacher-notes', auth, async function (req, res) {
  console.log("passing here")
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
  const students = await Etudiant.find()
  const users = await Personnel.find()
  const courses = await Cour.find()
  const notes = await Note.find()
  const classes = await Classe.find()
  res.status(200).json({ message: { students, users, courses, notes, classes } })
});
router.get('/notes-courses',auth,(req,res)=>{
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
 
  res.status(200).json({ message: {test:" notes, courses" } })
  res.status(200).json({ message: {test:" notes, courses" } })

})
router.get('/correct', auth, async function (req, res) {
  console.log("passing here")
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
  const students = await Etudiant.find()
  const classes = await Classe.find()
  const courses = await Cour.find()
  const evaluations = await Evaluation.find()
  const copies = await Copie.find()
  const notes = await Note.find()
  console.log(students,classes,courses,copies,evaluations,notes)
  res.status(200).json({ message: { students, classes, courses, evaluations, copies, notes } })
});

router.post('/new', auth , async (req,res)=>{
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
    console.log(req.body.note)
  const Not = new Note({...req.body.note})
  
  Not.save()
    .then(note=>note._id? res.status(200).json({message: note}):res.status(500).json({error: "could not save note"}))
    .catch(err=>res.status(500).json({error: err.message}))
})

router.put('/:idNote/update', auth , async (req,res)=>{
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
  let oldNote = await Note.findOne({_id: req.params.idNote}).then(note=>note)
  if (!oldNote) return res.status(500).json({error: "could not find note"})
  let { notes, startDate } = oldNote;

  oldNote.history.push({ notes, startDate, changeDate: Date.now() })
  console.log(oldNote)

  Note.findByIdAndUpdate({ _id:req.params.idNote }, {...req.body.note, history: oldNote.history}, { new: true })
    .then(note => res.status(200).json({ message: note }))
    .catch(error => res.status(500).json({ error: error.message }))
})

router.put('/examen/:idCopie/update', auth , async (req,res)=>{
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
  let oldCopie = await Copie.findOne({_id: req.params.idCopie}).then(copy=>copy)
  if (!oldCopie) return res.status(500).json({error: "could not find Copie"})

  oldCopie.history.push({ changeDate: Date.now() })
  console.log(oldCopie)

  Copie.findByIdAndUpdate({ _id:req.params.idCopie }, {...req.body.copie, history: oldCopie.history}, { new: true })
    .then(copie => res.status(200).json({ message: copie }))
    .catch(error => res.status(500).json({ error: error.message }))
})
module.exports = router;