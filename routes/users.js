const router = require('express').Router();
let User = require('../models/user.model');
const controllers=require('../controller/user')
const sendMail=require('../controller/sendMail.js')
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const newUser = new User({ username });

    newUser.save()
        .then(() => res.json('User added successfully'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/signup',controllers.signup);
router.get('/mail',sendMail);
module.exports = router;