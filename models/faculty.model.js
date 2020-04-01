const mongoose = require('mongoose');
const filiereSchema = require('./filiere.model')

const Schema = mongoose.Schema;


const falcultySchema = new Schema({
  nomFalculty: {
    type: String,
    required: true,
    unique: true,
  },
  filieres: [filiereSchema],
  startDate: {
    type: Date,
    require: true
  },
  history: [
  	{
  		_id: String,
  		nomFalculty: String,
      filieres: [filiereSchema],
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});

const Falculty = mongoose.model('Falculty', falcultySchema);

module.exports = Falculty;