const mongoose=require('mongoose');

const etudiantSchema=mongoose.Schema({
	matricule:{
		type:String,
		required:true,
		unique:true
	},
	nom: {
		type:String,
		required:true
	},
	prenom:{
		type:String,
		required:true
	},
	idClasse:{
		type:String,
		required:true
	},
	hash:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
  tel:{
  	type:Number,
  	required:true
  },
  startDate: {
  	type: Date,
  	required: true
  },
  history:[{
	  _id:String,
		matri:String,
		nom:String,
		prenom:String,
		idClasse:String,
		email:String,
	  tel:Number,
	  startDate: Date,
	  changeDate: Date
   }]
})

module.exports=mongoose.model('Etudiant',etudiantSchema)