const mongoose = require('mongoose');

// specifying the table schema that should be in the db
const userSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	firstName : {type : String, required : true},
	lastName : {type : String, required : true},
	mail : {type : String, required : true},
	password : {type : String, required : true},
	userImage : {type : String, required : false}
});

module.exports = mongoose.model('User', userSchema);
