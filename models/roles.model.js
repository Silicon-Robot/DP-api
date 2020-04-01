const mongoose=require('mongoose');

const roleSchema=mongoose.Schema({
	nomRole:{
		type:String,
		required:true
	},
	startDate:{
		type:Date,
		required:true
	},
	history:[
		{
			_id:String,
		   nomRole:String
		   startDate:Date,			
		   changeDate:Date,			
		}]
	}
	]
})

module.exports=roleSchema;