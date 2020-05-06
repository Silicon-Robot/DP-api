const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');
const Transaction = require("mongoose-transactions");
const transaction = new Transaction();

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Coordonnateur = require('../models/coordonnateur.model');
const Timetable = require('../models/timetable.model');
const Classe = require('../models/classe.model');
const Faculty = require('../models/faculty.model');
const Cour = require('../models/cours.model');
const Batiment = require('../models/batiment.model');
const Personnel = require('../models/personnel.model');


router.get('/coordo-classes-timetables-courses-batiment-faculties-users', auth, async function (req, res) {
  if (req.role !== "coordonateur") return res.status(502).json({ error: "auth failed" })
  const coordos = await Coordonnateur.find()
  const courses = await Cour.find()
  const timetables = await Timetable.find()
  const batiment = await Batiment.find()
  const classes = await Classe.find()
  const faculties = await Faculty.find()
  const users = await Personnel.find()
  res.status(200).json({ message: { coordos, courses, batiment, timetables, faculties, classes, users } })
  
})

router.put('/update', auth, async (req,res)=>{
  console.log(req.body)
  if (req.role !== "coordonateur") return res.status(502).json({ error: "auth failed" })
  let { timetable, classe, matricule } = req.body;
  let oldCoordo = await Coordonnateur.findOne({matriculePersonnel: matricule}).then(coordo=>coordo);
  if (!oldCoordo) return res.status(404).json({error: "Coordo not found"});
  
  let { _id, idPersonnel, matriculePersonnel, classes, timetables, startDate } = oldCoordo
  oldCoordo.history.push({ _id, classes, idPersonnel, matriculePersonnel, timetables, startDate, changeDate: Date.now() })
  let indexTC = oldCoordo.timetables.findIndex(timetable=>timetable.classe===classe);
  if (indexTC<0) return res.status(404).json({error: "Coordo's timetable not found"});
  oldCoordo.timetables[indexTC].timetable = timetable;

  Coordonnateur.findByIdAndUpdate({_id},oldCoordo,{new: true})
    .then(coordo=>res.status(200).json({message: coordo}))
    .catch(error=>res.status(500).json({error: error.message}))

})

router.put('/update-publish', auth, async (req,res)=>{
  console.log(req.body)
  if (req.role !== "coordonateur") return res.status(502).json({ error: "auth failed" })
  let { timetable, classe, matricule } = req.body;
  let oldCoordo = await Coordonnateur.findOne({matriculePersonnel: matricule}).then(coordo=>coordo);
  let oldTimetable = await Timetable.findOne({"classe.idClasse" : classe.split(' ')[2]}).then(timetable=>timetable);
  if (!oldCoordo) {return res.status(404).json({error: "Coordo not found"});}
  if (!oldTimetable) console.log("Timetable not found")
  
  let { _id, idPersonnel, matriculePersonnel, classes, timetables, startDate } = oldCoordo
  const idCoordo =_id;
  oldCoordo.history.push({ _id, classes, idPersonnel, matriculePersonnel, timetables, startDate, changeDate: Date.now() })
  let indexTC = oldCoordo.timetables.findIndex(timetable=>timetable.classe===classe.split(' ')[2]);
  if (indexTC<0) return res.status(404).json({error: "Coordo's timetable not found"});
  oldCoordo.timetables[indexTC].timetable = timetable;
  
  const start = async () => {
    try {
      transaction.update('Coordonnateur',idCoordo,oldCoordo);
      if(oldTimetable){
        let { _id, classe, tableHeader, table, startDate } = oldTimetable;
        const idTimetable =_id;
        oldTimetable.history.push({ _id, classe, tableHeader, table, startDate, changeDate: Date.now() })
        oldTimetable.tableHeader = timetable.tableHeader;
        oldTimetable.table = timetable.table;
        transaction.update('Timetable',idTimetable,oldTimetable)
      }
      else {
        transaction.insert('Timetable',{
          classe: {
            idClasse: classe.split(' ')[2],
            nomClasse: classe.split(' ')[0] + ' ' + classe.split(' ')[1]
          },
          tableHeader: timetable.tableHeader,
          table: timetable.table,
          startDate: req.body.startDate
        })
      }

      const final = await transaction.run();
      res.status(200).json({ message: oldCoordo })
    } catch (error) {
      console.error(error);
      await transaction.rollback().catch(console.error);
      transaction.clean();
      res.status(500).json({ error: error })
    }
  }

  start();
})

module.exports = router;