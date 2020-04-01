const mongoose=require('mongoose');

const batimentSchema=mongoose.Schema({
  nomBatiment:{
    type:String,
    requied:true
  },
  idFaculty:{
    type:String,
    requied:true
  },
  salle_de_cours: [
    { 
      idSalle:String,
      nomSalle:String, 
      capacite:Number 
    }
  ],
  history:[
  	{
      nomBatiment:String,
	    idFaculty:String,
	    salle_de_cours: [
	    	{ 
	    		idSalle:String,
          nomSalle:String,
	    		capacite:Number 
	    	}
	    ]	
    }
  ]
})

module.exports=mongoose.model('Batiment',batimentSchema);