const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const evaluationSchema = new Schema({
  idPersonnel: {
    type: String,
    required: true
  },
  idCour: {
    type: String,
    required: true
  },
  duree: {
    type: String,
    required: true
  },
  idTypeEvaluation: {
    type: Number,
    require: true
  },
  questions: [],
  published:{
    type: Boolean,
    require:true
  },
  startDate:{
    type: Date,
    require: true
  },
  history: [
    {
      _id: String,
      idPersonnel: String,
      idCour: String,
      duree: String,
      idTypeEvaluation: Number,
      questions: [],
      published: Boolean,
      startDate: Date,
      changeDate: Date
    }
  ]
});

module.exports = mongoose.model("Evaluation",evaluationSchema);