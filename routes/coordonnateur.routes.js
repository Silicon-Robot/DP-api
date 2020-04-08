const express = require('express')
const router = express.Router();

const horaire = require('../controllers/horaire.controller');

router.use('/horaire', horaire)


module.exports = router;