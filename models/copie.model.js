const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const copieSchema = new Schema({
  idEvaluation: {
    type: String,
    required: true
  },
  idEtudiant: {
    type: String,
    required: true
  },
  idTypeEvaluation: {
    type: Number,
    require: true
  },
  proposition: [],
  submitted: {
    type: Boolean
  },
  startDate:{
    type: Date,
    require: true
  },
  history: [
    {
      _id: String,
      idEvaluation: String,
      idEtudiant: String,
      idTypeEvaluation: Number,
      proposition: [],
      submitted: Boolean,
      startDate: Date,
      changeDate: Date
    }
  ]
});

module.exports = mongoose.model("Copie",copieSchema);