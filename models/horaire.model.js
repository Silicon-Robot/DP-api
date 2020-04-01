const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const horaireSchema = new Schema({
  debutJournee: {
    type: Date,
    required: true,
  },
  finJournee: {
    type: Date,
    required: true,
  },
  dureeCour: {
    type: Date,
    required: true,
  },
  heurePause: [
  	{
  		heure: Date,
  		duree: Date,
  	}
  ],
  startDate: {
    type: Date,
    require: true
  },
  history: [
  	{
  		_id: String,
  		debutJournee: Date,
  		finJournee: Date,
  		dureeCour: Date,
  		heurePause: [
  			{
  				heure: Date,
  				duree: Date
  			}
  		],
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});

module.exports = horaireSchema;