const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const natureCoursSchema = new Schema({
	nomNature: {
		type: String,
		required: true
	}
})

module.exports = natureCoursSchema