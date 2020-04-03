const express = require('express')
const router = express.Router();
const app = express()

const signUp = require('../controllers/signUp.controller');
const signIn = require('../controllers/signIn.controller');
const resetPwd = require('../controllers/resetPwd.controller');
const sendMail = require('../controllers/sendMail.controller');

router.post('/signup',(req, res)=> signUp(req, res))

router.post('/signin',(req, res)=> signIn(req, res))

router.put('/reset-password',(req, res)=> resetPwd(req, res))

router.post('/send-mail',(req, res)=> sendMail(req, res))



module.exports = router;