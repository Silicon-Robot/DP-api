const mongoose=require('mongoose');
const roleSchema=require('./roles.js')

const personnelSchema=mongoose.Schema({
	Matricule:{
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
  role:roleSchema,
  history:[{
	  _id:String,
		Matricule:String,
		nom:String,
		prenom:String,
		email:String,
	  tel:Number,
	  role:roleSchema,
	  startDate: Date,
	  changeDate: Date
   }]
})

module.exports=mongoose.model('Personnel',personnelSchema)