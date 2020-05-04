const mongoose = require('mongoose');
const horaireSchema = require('./horaire.model')

const Schema = mongoose.Schema;


const coordonnateurSchema = new Schema({
  idPersonnel: {
    type: String,
    required: true,
    unique: true
  },
  matriculePersonnel: {
    type: String,
    required: true,
    unique: true
  },
  classes: [String],
  startDate: {
    type: Date,
    require: true
  },
  timetables: [
    {
      classe: String,
      timetable:{}
    }
  ],
  history: [
  	{
  		_id: String,
  		idPersonnel: String,
  		matriculePersonnel: String,
      classes: [String],
      timetables: [],
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});

const Coordonnateur = mongoose.model('Coordonnateur', coordonnateurSchema);

module.exports = Coordonnateur;