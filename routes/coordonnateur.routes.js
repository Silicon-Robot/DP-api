const express = require('express')
const router = express.Router();

const horaire = require('../controllers/horaire.controller');
const teacherCourses = require('../controllers/teacherCourses.controller');

router.use('/horaire', horaire)
router.use('/teacher-courses', teacherCourses)

module.exports = router;