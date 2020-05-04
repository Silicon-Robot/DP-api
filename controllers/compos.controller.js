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
  console.log(courses,notes)
  res.status(200).json({ message: { notes, courses } })

})
module.exports = router;