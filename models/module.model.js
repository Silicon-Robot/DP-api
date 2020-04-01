const mongoose=require('mongoose');

const Schema = mongoose.Schema;

const moduleSchema=mongoose.Schema({
	codeModule:{
    type:Number,
    required:true,
    unique:true
  },
	nomModule:{
    type:String,
    required:true
  },
	idClasse:{
    type:String,
    required:true
  },
	credit:Number,
  startDate: {
    type:Date,
    required: true
  }
	cours: [
    {
      idCours:{
        type:String,
        required:true
      },
      nomCours:{
        type:String,
        required:true
      },
      codeDuCours:{
        type:Number,
        required:true
      },
      poids:Number,
      idPersonnel:{
        type:String,
        required:true
      }
    }
  ],
  history: [
    {
      _id:String,
  	  codeModule:Number,
  	  nomModule:String,
  	  idClasse:String,
  	  credit:Number,
      startDate:Date,
      changeDate: Date,
  	  cours: [
        {
          idCours:String,
          nomCours:String,
          codeDuCours:Number,
          poids:Number,
          idEnseignant:String
        }
      ]
    }
  ]
})

module.exports=mongoose.model('Module',moduleSchema)