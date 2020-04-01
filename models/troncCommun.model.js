const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const troncCommunSchema = new Schema({
  idCour: {
    type: String,
    required: true,
  },
  classes: [String],
  startDate: {
    type: Date,
    require: true
  },
  history: [
  	{
  		_id: String,
  		idCour: String,
      classes: [String],
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});

const TroncCommun = mongoose.model('TroncCommun', troncCommunSchema);

module.exports = TroncCommun;