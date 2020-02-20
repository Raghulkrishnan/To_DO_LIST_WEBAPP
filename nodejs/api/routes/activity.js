const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// that re_model file
const Activity = require('../models/activity_model');

// Get all activities 
router.get('/getAllActivities/:userId', (req, res, next) =>{
	// Activity.find()
	Activity.find({activityUserId: req.params.userId}).exec().then(doc =>{
	// .select(' _id firstname lastname mail') OR .select('-password')
	// and format of api return of the data will also change. If needed, watch class video
		if(doc != null){
			console.log(doc); 
			res.status(200).json({
				activityData : doc
			});
		}
		else{
			console.log(doc);
			res.status(404).json({
				message : "Activity not found"
			});
		}
	}).catch(err =>{		
		console.log(err);
		res.status(500).json({
			error : err
		});
	});
});

// Get activity by ID
router.get('/getActivityById/:activityId', (req, res, next) =>{
	
	const id = req.params.activityId;

	// USE MONGODB METHOD
	Activity.findById(id).exec().then(doc =>{
		console.log("From DB: " + doc);
		res.status(200).json({
			message : "Activity with " + id + " returned",
			activityData : doc
		});

	}).catch(err =>{
		console.log(err);
		res.status(500).json({
			error : err
		});
	});
});

// Add new activity
router.post('/newActivity', (req, res, next) =>{
	// _id is set to a mongodb generated objectId
	
	const newActivity = new Activity({
		_id : new mongoose.Types.ObjectId(),
		activityUserId : req.body.activityUserId,
		activityName : req.body.activityName,
		activityDescription : req.body.activityDescription,
		activityStatus : req.body.activityStatus,
		activityPriority :req.body.activityPriority
	});
	
	// after connecting to db - we are saving it in db
	newActivity.save().then(result =>{
		res.status(201).json({
			message : "New activity added successfully",
			activityData : newActivity
		});
	}).catch(err =>{
		console.log(err);
		res.status(500).json({
			error : err
		});
	});

});

// Delete a activity
// WORKS FINE! Put it in a different route or change the route name from registration to Activity ! Thats more better
router.delete('/deleteActivity/:userId/:activityId', (req, res, next) =>{
	const activityId = req.params.activityId;
	const userId = req.params.userId;

// remove method of mongodb
	Activity.remove({ _id : activityId, activityUserId : userId}).exec().then(result =>{
		res.status(200).json({
			message : "Activity with ID: " + activityId + " deleted successfully",
			activityData : result
		});

	}).catch(err =>{
		res.status(500).json({
			error : err
		})
	});
	
});


// update - activity propName in req.body
router.patch('/updateActivity/:activityId', (req, res, next) =>{
	const id = req.params.activityId;

	const updateOps = {};

	for (const [key, value] of Object.entries(req.body)) {
		  updateOps[key] = value;
	}

	// for(const ops of Object.keys(req.body)) {
	// 	updateOps[ops.propName] = ops.value;
	// }

// update method of mongodb
// in that _id,  $set the new values!!

// the update method is being depricated. so use updateOne or updateMany etc..
	Activity.updateOne({ _id : id}, {$set: updateOps}).exec().then(result =>{
		// console.log(result);
		res.status(200).json({
			message : "Activity updated successfully",
			activityData : result
		});
	}).catch(err =>{
		res.status(500).json({
			error: err
		});
	})
});



module.exports = router;