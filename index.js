require('dotenv').config();
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const dbConnect = require('./db.connect');

const handle = require('./handlers')
const personnelRoutes = require('./routes/personnel.routes')
const managePersonnel = require('./controllers/managePersonnel.controller')


app.use(cors({
  methods: ["POST", "GET", "PUT", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Content-Type",
    "x-access-token"
  ]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', personnelRoutes)
app.use('/manage-personnel',managePersonnel)

app.get('/', (req, res) =>{console.log("someone is here"); res.json({ hello: 'world' })});
  
const port = process.env.PORT;
  
app.listen(port, console.log(`Server started on port [${port}]`));