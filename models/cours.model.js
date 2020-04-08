const mongoose=require('mongoose');
const natureCoursSchema = require('./natureCours.model')

const Schema = mongoose.Schema;

const coursSchema=mongoose.Schema({
  startDate: {
    type:Date,
    required:true
  },
  codeDuCours: {
    type:Number,
    required:true
  },
  natureCours: [natureCoursSchema],
  nomCours: {
    type:String,
    required:true
  },
  history: [
    {
      _id: String,
      startDate: Date,
      changeDate: Date,
      codeDuCours: Number,
      nomCours: String,   	
      natureCours: [natureCoursSchema], 
    }
  ]
})

const Cours = mongoose.model('Cours', coursSchema);

module.exports=Cours