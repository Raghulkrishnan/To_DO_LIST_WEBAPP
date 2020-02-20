const restUrl = "http://localhost:3000/"

// Add User
function RegisterUser(obj, callback) {
    console.log(obj);
    $.ajax({
        url: restUrl + "user/newUser",
        method: "POST",
        data: obj,
        success: function (data) {
            console.log(data);
            callback(data);
        },
        error: function (err) {
            console.log(err);
            if(err.status == 500){
                notif({msg : "Internal Server Error", type: "warning"});
                callback(-1);
            }
            else {
                notif({msg : "Connection problem. Try again later", type: "warning"});
                callback(-1);
            }
        }
    });
}

// Login User function
function LoginUser(obj, callback) {
    console.log(obj);
    $.ajax({
        url: restUrl + "user/userLogin/" + obj.username + "/" + obj.password,
        method: "GET",
        success: function (data) {
            console.log(data);
            callback(data);
        },
        error: function (err) {
            console.log(err);
            if(err.status == 404){
                notif({msg : "User name or password incorrect. Please try again or register.", type: "warning"});
                callback(-1);
            }
            else if(err.status == 500){
                notif({msg : "Internal Server Error", type: "warning"});
                callback(-1);
            }
            else {
                notif({msg : "Connection problem. Try again later", type: "warning"});
                callback(-1);
            }
        }
    });
}

// Get user by ID
function GetUserById(userId, callback) { 
    $.ajax({
        url: restUrl + "user/getUserById/" + userId,
        method: "GET",
        success: function(data){
            console.log(data);
            callback(data);
        },
        error: function(err) {
            console.log(err);
            if(err.status == 404){
                notif({msg : "User data not found. Please register.", type: "warning"});
                callback(-1);
            }
            else if(err.status == 500){
                notif({msg : "Internal Server Error", type: "warning"});
                callback(-1);
            }
        }
    });
}

// Add activity
function AddActivity(activityObj, callback) {
    console.log(activityObj);
    $.ajax({
        url: restUrl + "activity/newActivity",
        method: "POST",
        data: activityObj,
        success: function (data) {
            console.log(data);
            callback(data);
        },
        error: function (err) {
            if(err.status == 500){
                callback(-1);
            }
        }
    });
}

// Getting all activities
function GetActivities(userId, callback) {
    console.log(userId);
    $.ajax({
        url: restUrl + "activity/getAllActivities/" + userId,
        method: "GET",
        success: function (data) {
            console.log(data);
            callback(data);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// delete activity
function DeleteActivity(userId, activityId, callback) {
    console.log(userId);
    console.log(activityId);
    $.ajax({
        url: restUrl + "activity/deleteActivity/" + userId + "/" + activityId,
        method: "DELETE",
        success: function (data) {
            console.log(data);
            callback(data);
        },
        error: function (err) {
            console.log(err);
            if(err.status == 500){
                callback(-1);
            }
        }
    });
}

// update user
function UpdateActivity(activityId, activityObj, callback){
    console.log(activityObj);
    $.ajax({
        url: restUrl + "activity/updateActivity/" + activityId,
        method: "PATCH",
        data: activityObj,
        success: function (data) {
            console.log(data);
            callback(data);
        },
        error: function (err) {
            console.log(err);
            // callback(data);
            if(err.status == 500){
                callback(-1);
            }
        }
    });
}

// update user
function UpdateUserDetail(userId, userObj, callback){
    $.ajax({
        url: restUrl + "user/updateUser/" + userId,
        method: "PATCH",
        data: userObj,
        success: function (data) {
            console.log(data);
            callback(data);
        },
        error: function (err) {
            console.log(err);
            // callback(data);
            if(err.status == 500){
                callback(-1);
            }
        }
    });
}