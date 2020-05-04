const express = require('express')
const router = express.Router();

const auth = require('../middlewares/auth');

const Timetable = require('../models/timetable.model');
const Etudiant = require('../models/etudiant.model');

const compos = require('../controllers/compos.controller')

router.use('/compos',compos)

router.get('/timetable', auth, async (req,res)=>{
  if (req.role !== "etudiant") return res.status(502).json({ error: "auth failed" })
  let id = req.userId;
  const timetables = await Timetable.find()
  const users = await Etudiant.findOne({_id: id}).then(user=>user)
const student = {...users._doc, hash:null, history: null }
console.log(student)
  res.status(200).json({ message: { timetables, student:[student] } })

})

module.exports = router;