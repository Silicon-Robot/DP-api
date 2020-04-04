const express = require('express');
const router = express.Router({mergeParams: true});
const bodyParser = require('body-parser');

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Faculty = require('../models/faculty.model');

const filiere = require('../controllers/filiere.controller');

router.use('/:id/filiere', filiere )

router.get('/', auth, function (req, res) {
  Faculty.find()
    .then(facultx => {
      res.status(200).json({ message: facultx });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.post('/new', auth, function (req, res) {
  const { nomFaculty, filieres, startDate } = req.body;

      const Fac = new Faculty({
        nomFaculty,
        startDate,
        filieres
      })
      Fac.save()
        .then(faculty => {
          res.status(200).json({ message: `Faculty ${faculty.nomFaculty} was created` })
        })
        .catch(err => res.status(500).json({ error: err.message }))
});


router.get('/:id', auth, function (req, res) {
  Faculty.findById(req.params.id)
    .then(faculty => {
      res.status(200).json({ message: faculty });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.delete('/:id/delete', auth, function (req, res) {
  Faculty.findByIdAndRemove(req.params.id)
    .then(faculty => {
      res.status(200).json({ message: `faculty ${faculty.nomFaculty} was deleted` });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.put('/:id/update', auth, async (req, res) => {
  const { id } = req.params;
  const oldFaculty = await Faculty.findById(id);
  const { nomFaculty, filieres, startDate } = oldFaculty;

  oldFaculty.history.push({ nomFaculty, filieres, startDate, changeDate: Date.now() })

  Faculty.findOneAndUpdate({ id }, { ...req.body, history: oldfaculty.history }, { new: true })
    .then(faculty => {
      res.status(200).json({ message: `faculty ${faculty.nomFaculty} was updated` });
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

module.exports = router;