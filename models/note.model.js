const mongoose=require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = Schema({
	idEtudiant:{
    type:String,
    required:true,
    unique:true
  },
	idCour:{
    type:String,
    required:true
  },
	notes:{},
  startDate: {
    type:Date,
    required: true
  },
  history: [
    {
      _id:String,
  	  idEtudiant:String,
  	  idCour:String,
  	  notes:{},
      startDate:Date,
      changeDate: Date
    }
  ]
})

module.exports=mongoose.model('Note',noteSchema)