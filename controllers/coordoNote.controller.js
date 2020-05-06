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
const Coordo = require('../models/coordonnateur.model');
const Note = require('../models/note.model');
const Personnel = require('../models/personnel.model');
const Module = require('../models/module.model');

router.get('/', auth, async function (req, res) {
  console.log("passing here")
  if (req.role !== "coordonateur") return res.status(502).json({ error: "auth failed" })
  const users = await Personnel.find()
  const courses = await Cour.find()
  const notes = await Note.find()
  const modules = await Module.find()
  const classes = await Classe.find()
  const coordos = await Coordo.find()
  res.status(200).json({ message: { coordos, classes, modules, users, courses, notes } })
});
router.put('/:idNote/publish', auth, async (req, res) => {
  if (req.role !== "coordonateur") return res.status(502).json({ error: "auth failed" })
  const { idNote } = req.params ;
  const oldNote = await Note.findById(idNote);
  const { _id, idEtudiant, idCour, notes, startDate } = oldNote;

  oldNote.history.push({ _id, idEtudiant, idCour, notes, startDate, changeDate: Date.now() })

  Note.findOneAndUpdate({ idNote }, { ...req.body.note, history: oldNote.history }, { new: true })
    .then(note => {
      res.status(200).json({ message: note });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});
module.exports = router;