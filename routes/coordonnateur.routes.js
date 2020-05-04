const express = require('express')
const router = express.Router();

const timetable = require('../controllers/timetable.controller');
const teacherCourses = require('../controllers/teacherCourses.controller');
const coordoNote = require('../controllers/coordoNote.controller');

router.use('/teacher-courses', teacherCourses)
router.use('/timetable', timetable)
router.use('/note',coordoNote)
module.exports = router;