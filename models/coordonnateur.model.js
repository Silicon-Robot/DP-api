const mongoose = require('mongoose');
const horaireSchema = require('./horaire.model')
const classSchema = require('./class.model')

const Schema = mongoose.Schema;


const coordonnateurSchema = new Schema({
  idPersonnel: {
    type: String,
    required: true,
  },
  classes: [classSchema],
  horaire:horaire,
  startDate: {
    type: Date,
    require: true
  },
  history: [
  	{
  		_id: String,
  		idPersonnel: String,
      classes: [classSchema],
      horaire:horaireSchema,
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});

const Coordonnateur = mongoose.model('Coordonnateur', coordonnateurSchema);

module.exports = Coordonnateur;