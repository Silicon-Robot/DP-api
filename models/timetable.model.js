const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const timeTableSchema = new Schema({
	classe:{
		idClasse:{
			type: String,
			require: true
		},
		nomClasse:{
			type: String,
			require: true
		}
	},
	tableHeader: {
		weekStart: {
			type: String,
			require: true
		},
		weekEnd: {
			type: String,
			require: true
		}
	},
	table: [],
  startDate: {
    type: Date,
    require: true
  },
  history: [
  	{
  		_id: String,
  		classe: {},
  		tableHeader: {},
  		startDate: Date,
  		changeDate: Date,
			table: []
  	}
  ]
});

const TimeTable = mongoose.model('Timetable', timeTableSchema);

module.exports = TimeTable;