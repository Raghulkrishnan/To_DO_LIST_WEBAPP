const mongoose = require('mongoose');

// specifying the table schema that should be in the db
const activitySchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	activityUserId : {type : String, required : true},
	activityName : {type : String, required : true},
	activityDescription : {type : String, required : true},
	activityStatus : {type : String, required : true},
	activityPriority : {type : Boolean, required : true} //true - HIGH , false - LOW
});

module.exports = mongoose.model('Activity', activitySchema);
