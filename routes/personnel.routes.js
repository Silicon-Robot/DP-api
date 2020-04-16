const express = require('express')
const router = express.Router();

const auth = require('../middlewares/auth')

const signUp = require('../controllers/signUp.controller');
const signIn = require('../controllers/signIn.controller');
const resetPwd = require('../controllers/resetPwd.controller');
const sendMail = require('../controllers/sendMail.controller');

const managePersonnel = require('../controllers/managePersonnel.controller');

router.use('/manage-personnel', managePersonnel)

router.post('/signup',(req, res)=> signUp(req, res))

router.post('/signin',(req, res)=> signIn(req, res))

router.put('/reset-password',auth,(req, res)=> resetPwd(req, res))

router.post('/send-mail',(req, res)=> sendMail(req, res))



module.exports = router;