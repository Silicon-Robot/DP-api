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
  res.status(200).json({ message: { students, users, courses, notes } })
});
router.get('/notes-courses',auth,(req,res)=>{
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
 
  res.status(200).json({ message: {test:" notes, courses" } })
  res.status(200).json({ message: {test:" notes, courses" } })

})
module.exports = router;