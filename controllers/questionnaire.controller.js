const express = require('express');
const path = require('path');
const crypto = require('crypto');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');
const Transaction = require("mongoose-transactions");
const transaction = new Transaction();
const multer = require('multer');
const mongoose= require('mongoose');
const GridFsStorage = require("multer-gridfs-storage");

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Coordonnateur = require('../models/coordonnateur.model');
const Timetable = require('../models/timetable.model');
const Classe = require('../models/classe.model');
const Evaluation = require('../models/evaluation.model');
const Cour = require('../models/cours.model');
const Batiment = require('../models/batiment.model');
const Personnel = require('../models/personnel.model');


const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(10, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({
  storage
});

router.post("/upload", upload.array("files"), (req, res) => {
  if(!req.files) return res.status(500).json({error: "Failed"})
    console.log(req.files[0])
  return res.status(200).json({files : req.files.map(file=>file.id)})
});

router.get("/images", (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist"
      });
    }

    return res.json(files);
  });
});

router.get("/files/:filename", (req, res) => {
  gfs.find(
    {
      filename: req.params.filename
    },
    (err, file) => {
      if (!file) {
        return res.status(404).json({
          err: "no files exist"
        });
      }

      return res.json(file);
    }
  );
});

router.get("/image/:id", (req, res) => {
  const file = gfs
    .find({
      _id: new mongoose.Types.ObjectId(req.params.id)
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          error: "no files exist"
        });
      }
      gfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.id)).pipe(res);
    });
});

router.delete("/image/del/:id", (req, res) => {
  gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
    res.status(200).json({message:"deleted"})
  });
});

router.delete("/image/dels", (req, res) => {
  console.log(req.body)
    req.body.ids.forEach(async id=> await gfs.delete(new mongoose.Types.ObjectId(id)).then(data=> res.status(200).json({message:"deleted"})).catch(err=>res.status(500).json({error: err.message})))
});

router.get('/evaluation-classes-courses', auth, async function (req, res) {
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
  const courses = await Cour.find()
  const classes = await Classe.find()
  const evaluations = await Evaluation.find()
  res.status(200).json({ message: { courses, classes, evaluations } })
  
})
// router.post('/upload',upload.array('files'),(req,res)=>{
//   if(req.files){
//     let TBuffer = req.files.map(file=>file.buffer)
//     // TBuffer = Buffer.concat(TBuffer)
//     res.contentType('png')
//     console.log(TBuffer[0].toString('base64'));
//     return res.status(200).json(TBuffer[0].toString('base64'))
//   }
//   res.status(500).json({error:"failed"});
// })
router.post('/new', auth, (req, res)=>{
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
  console.log(req.body.evaluation.questions[0].refFiles)  
  let nEvaluation = req.body.evaluation;
  let buffer = []
  // let newQestions = nEvaluation.questions.map(question=>{
  //   upload.array('images')(req,res, err=>{
  //     if(err) return res.status(500).json({error: err})
  //     console.log(req.files)
  //     let buffer = req.files.map(file=>file.buffer)
  //   })
  //   let tBuffer = Buffer.concat(buffer)
  //   console.log(tBuffer)
  //   res.contentType('image/png');
  //   res.send(tBuffer)
  // })
  const Eval = new Evaluation({...nEvaluation, startDate: req.body.startDate})
  
  Eval.save()
  .then(evaluation=>res.status(200).json({message: evaluation}))
  .catch(error=>res.status(500).json({error: error.message}))
})

router.delete('/:idEvaluation/delete', auth, (req,res)=>{
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
  console.log(req.params.idEvaluation)
  Evaluation.findByIdAndDelete(req.params.idEvaluation)
  .then(empty=>res.status(200).json({message: "Evalution deleted"}))
  .catch(error=>res.status(500).json({error: error.message}))
})

router.put('/:idEvaluation/update', auth, async (req, res) => {
  let { idEvaluation } = req.params;
  console.log(req.body,idEvaluation)
  if (req.role !== "enseignant") return res.status(502).json({ error: "auth failed" })
  let oldEval = await Evaluation.findById(idEvaluation).then(evaluation => evaluation);
  if (!oldEval) return res.status(404).json({ error: "Evaluation not found" });

  let { _id, idPersonnel, idCour, duree, startDate, published, questions } = oldEval
  oldEval.history.push({ _id, idPersonnel, idCour, duree, startDate, published, questions, changeDate: Date.now() })
  console.log(oldEval)

  Evaluation.findByIdAndUpdate({ _id:idEvaluation }, {...req.body.evaluation, history: oldEval.history}, { new: true })
    .then(evaluation => res.status(200).json({ message: evaluation }))
    .catch(error => res.status(500).json({ error: error.messaimage /pngge }))

})

router.put('/update-publish', auth, async (req, res) => {
  console.log(req.body)
  if (req.role !== "coordonnateur") return res.status(502).json({ error: "auth failed" })
  let { timetable, classe, matricule } = req.body;
  let oldCoordo = await Coordonnateur.findOne({ matriculePersonnel: matricule }).then(coordo => coordo);
  let oldTimetable = await Timetable.findOne({ "classe.idClasse": classe.split(' ')[2] }).then(timetable => timetable);
  if (!oldCoordo) { return res.status(404).json({ error: "Coordo not found" }); }
  if (!oldTimetable) console.log("Timetable not found")

  let { _id, idPersonnel, matriculePersonnel, classes, timetables, startDate } = oldCoordo
  const idCoordo = _id;
  oldCoordo.history.push({ _id, classes, idPersonnel, matriculePersonnel, timetables, startDate, changeDate: Date.now() })
  let indexTC = oldCoordo.timetables.findIndex(timetable => timetable.classe === classe.split(' ')[2]);
  if (indexTC < 0) return res.status(404).json({ error: "Coordo's timetable not found" });
  oldCoordo.timetables[indexTC].timetable = timetable;

  const start = async () => {
    try {
      transaction.update('Coordonnateur', idCoordo, oldCoordo);
      if (oldTimetable) {
        let { _id, classe, tableHeader, table, startDate } = oldTimetable;
        const idTimetable = _id;
        oldTimetable.history.push({ _id, classe, tableHeader, table, startDate, changeDate: Date.now() })
        oldTimetable.tableHeader = timetable.tableHeader;
        oldTimetable.table = timetable.table;
        transaction.update('Timetable', idTimetable, oldTimetable)
      }
      else {
        transaction.insert('Timetable', {
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