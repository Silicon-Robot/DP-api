const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Module = require('../models/module.model');
const Cour = require('../models/cours.model');
const Personnel = require('../models/personnel.model');
const Classe = require('../models/classe.model');
const Faculty = require('../models/faculty.model');

const cour = require('../controllers/cour.controller');

router.get('/users-courses-modules-faculties-classes', auth, async function (req, res) {
  if (req.role !== "secretaire") return res.status(502).json({ error: "auth failed" })
  const users = await Personnel.find()
  const courses = await Cour.find()
  const modules = await Module.find()
  const classes = await Classe.find()
  const faculties = await Faculty.find()
  res.status(200).json({ message: { users, courses, modules, faculties, classes } })
});
router.put('/update-cour', auth, (req, res)=>{
  if (req.role !== "secretaire") return res.status(502).json({ error: "auth failed" })
  console.log("passing")
  let { codeCour, teacherId } = req.body;
  Cour.findOneAndUpdate({codeCour},{nomEnseignant:teacherId},{new: true})
    .then(cour=>res.status(200).json({message: `Cour ${cour.nomCour} was updated`}))
    .catch(err=>res.status(500).json({error: err.message}))
})
module.exports = router