require('dotenv').config();
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const signupRoute=require('./routes/users')
const db = require('./models');
const handle = require('./handlers')
const managePersonnel=require('./routes/personnel.js')

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ hello: 'world' }));
app.use('/',signupRoute)
app.use('/',sendMailRoute)//sendMail
app.use('/api/personnel',managePersonnel)//Managment des requetes
app.use(handle.notFound)
app.use(handle.errors)
app.listen(port, console.log(`Server started on port ${port}`));