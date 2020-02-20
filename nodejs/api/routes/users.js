const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// that re_model file
const User = require('../models/user_model');


// login function
router.get('/userLogin/:username/:password', (req, res, next) =>{
// If you want data with either username or password. you can use $or operator.
// User.find({$or:[{mail: req.params.username},{password : req.params.password}]}

	User.find({mail: req.params.username, password : req.params.password}).exec().then(doc =>{
		if(doc != null && doc.length > 0){ 
			console.log(doc);
			res.status(200).json({
				message : "Valid User",
				userData : doc
			});
		}
		else{
			console.log(doc);
			res.status(404).json({
				message : "User not found"
			});
		}
	}).catch(err =>{
		res.status(500).json({
			error : err
		});
	});
});


//user update
router.get('/getUserById/:userId/', (req, res, next) =>{
	User.find({ _id: req.params.userId }).exec().then(doc =>{
		if(doc != null && doc.length > 0){ 
			res.status(200).json({
				message : "user details returned",
				userData : doc
			});
		}
		else{
			res.status(404).json({
				message : "User not found"
			});
		}
	}).catch(err =>{
		res.status(500).json({
			error : err
		});
	});
});


// Get all users 
router.get('/getAllUsers', (req, res, next) =>{
	User.find()
	// .select(' _id firstname lastname mail') OR .select('-password')
	// and format of api return of the data will also change. If needed, watch class video
	.exec().then(doc =>{
		res.status(200).json({
			userData : doc
		});
	}).catch(err =>{		
		console.log(err);
		res.status(500).json({
			error : err
		});
	});
});

// // Get user by ID
// router.get('/getUserById/:userId', (req, res, next) =>{
	
// 	const id = req.params.userId;

// 	// USE MONGODB METHOD
// 	User.findById(id).exec().then(doc =>{
// 		res.status(200).json({
// 			message : "User with " + id + " returned",
// 			userData : doc
// 		});

// 	}).catch(err =>{
// 		console.log(err);
// 		res.status(500).json({
// 			error : err
// 		});
// 	});
// });

// Add new user
router.post('/newUser', (req, res, next) =>{
	// _id is set to a mongodb generated objectId
	const newUser = new User({
		_id : new mongoose.Types.ObjectId(),
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		mail : req.body.mail,
		password : req.body.password
	});
	
	// after connecting to db - we are saving it in db
	newUser.save().then(result =>{
		res.status(201).json({
			message : "New user added successfully",
			userData : newUser
		});
	}).catch(err =>{
		console.log(err);
		res.status(500).json({
			error : err
		});
	});

});

// Delete a user
// WORKS FINE! Put it in a different route or change the route name from registration to USER ! Thats more better
router.delete('/deleteUser/:userId', (req, res, next) =>{
	const id = req.params.userId;

// remove method of mongodb
	User.remove({ _id : id}).exec().then(result =>{
		res.status(200).json({
			message : "User with ID: " + id + " deleted successfully",
			returnData : result
		});

	}).catch(err =>{
		res.status(500).json({
			error : err
		})
	});
	
});


// update - user propName in req.body
router.patch('/updateUser/:userId', (req, res, next) =>{
	const id = req.params.userId;

	const updateOps = {};

	for (const [key, value] of Object.entries(req.body)) {
		  updateOps[key] = value;
	}

// update method of mongodb
// in that _id,  $set the new values!!

// the update method is being depricated. so use updateOne or updateMany etc..
	User.updateOne({ _id : id}, {$set: updateOps}).exec().then(result =>{
		res.status(200).json({
			message : "User updated successfully",
			userData : result
		});
	}).catch(err =>{
		res.status(500).json({
			error: err
		});
	})
});


module.exports = router;