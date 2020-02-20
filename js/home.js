// Initially getting the values that I have stored in the local storage - the user details
var userDetails = JSON.parse(localStorage.getItem('userDetails'));
var userId = JSON.parse(localStorage.getItem('userId'));
// global variable to have activity _id for update
var updatedActivityId;
if(localStorage.getItem('userDetails') == "" || localStorage.getItem('userDetails') == null){
    notif({msg : "Did not log in. No activities displayed. Log in to continue", type:"warning"});
}

// 1. Get Activity List
$(document).ready(function(){
    GetActivities(JSON.parse(localStorage.getItem('userId')), function (data){
        DisplayActivityList(data);
    });
});

// 2. Add new activity
$('#add_activity_btn').click(function(){
    var isValid = true, message;
    var activity_hp = false;
    // checkbox value
    if ($('#highpriority').is(":checked"))
        activity_hp = true;  
    else
        activity_hp = false;

    if($('#activity_name').val() == ""){
        message = "Enter activity name";
        isValid = false;
    }
    else if($('#activity_description').val() == ""){
        message = "Enter activity description";
        isValid = false;
    }

    if(isValid){
        var activityDetails = {
            'activityUserId' : userId,
            'activityName' : $('#activity_name').val(),
            'activityDescription' : $('#activity_description').val(),
            'activityStatus' : $('input[name=status]:checked').val(),
            'activityPriority' : activity_hp
        };

        AddActivity(activityDetails, function(ret){
            // save form to default
            if(ret != -1){
                $('#activity_name, #activity_description').val('');
                $('#act_pend').prop("checked", true);
                $('#highpriority').prop("checked", false);

                // once added, get it immediately so that we can display on the page
                //displaying
                GetActivities(userId, function (data){
                    DisplayActivityList(data);
                });

                notif({msg : "Activity Added Successfully!!", type : "success"});
            }
            else{
                notif({msg: "Couldn't add activity. Try logging in again.", type : "warning"});
                return false;
            }
        });
    }
    else{
        isValid = false;
        notif({msg : message, type : "warning"});
        return isValid;
    }
});

// 3. Get and View the Activity Data
function DisplayActivityList(data){
    // first updating the activity info in the first column
    var hpCount = 0, pendCount = 0, compCount = 0;

    $('#activity_list_area').html('');

    for(let i = 0 ; i < data.activityData.length; i++){

        //high priority and pending count calculation to be displayed
        if(data.activityData[i].activityPriority == true)
            hpCount += 1;

        if(data.activityData[i].activityStatus == "pending")
            pendCount +=1;
        else if(data.activityData[i].activityStatus == "completed")
            compCount += 1;
         
        $('#activity_list_area').append(
            $('<div>').attr({'class' : 'panel-heading'}).append(
                $('<h4>').attr({'class' : 'panel-title'}).append(
                    $('<a data-toggle="collapse">').attr({"href": "#collapse"+ i,"id":"activity_list_name" + i })
                )
            )
        ).append(
            $('<div>').attr({"id" : "collapse"+i , "class" : "panel-collapse collapse"}).append(
                $('<div>').attr({"class" : "panel-body", "id": "activity_list_body"+i})
            ).append(
                $('<div>').attr({"class" : "panel-footer", "id" : "activity_list_footer"+i})
            )
        );

        $('#activity_list_name' + i).append(
            $('<i>').attr({'class' : "fa fa-calendar"}).append(
            " : " + data.activityData[i].activityName
            ));
        $('#activity_list_body' + i).append("<strong>DESCRIPTION: </strong>" + data.activityData[i].activityDescription).append(
                $('<div>').append("<strong>STATUS: </strong>" + data.activityData[i].activityStatus)
            );
        $('#activity_list_footer' + i).append(
            $("<button>").attr({"id" : data.activityData[i]._id, "class" : "btn btn-sm btn-info", 
            "onclick" : "javascript:EditActivity(\'" + JSON.stringify(data.activityData[i]) + "\');"}).append("EDIT")
        );
    }

    $('#total_act_count').text(data.activityData.length);
    $('#completed_act_count').text(compCount);
    $('#pending_act_count').text(pendCount);
    $('#total_hp_count').text(hpCount);

}

// 4. Edit Activity Data
function EditActivity(data){
    // console.log(id);
    let activityDetail = JSON.parse(data);

    console.log(activityDetail);
    updatedActivityId = activityDetail._id;

    $('#activity_edit_name').val(activityDetail.activityName);
    $('#activity_edit_description').val(activityDetail.activityDescription);

    // radio button
    $('input[name=status][value=' + activityDetail.activityStatus + ']').prop("checked", true);
    // checkbox
    if(activityDetail.activityPriority)
        $('#highpriority_edit').prop("checked", true);
    else
        $('#highpriority_edit').prop("checked", false);
} 

// update click function
$('#update_activity_btn').click(function(){
    var uId = JSON.parse(localStorage.getItem('userId'));

    if(localStorage.getItem('userDetails') != null && localStorage.getItem('userId') != null){
         var activity_hp_edit = false;
        // checkbox value
        if ($('#highpriority_edit').is(":checked"))
            activity_hp_edit = true;  
        else
            activity_hp_edit = false;
        
        var actObj = {
            activityUserId : uId,
            activityName :  $('#activity_edit_name').val(),
            activityDescription : $('#activity_edit_description').val(),
            activityStatus :  $('input[name=upd_status]:checked').val(),
            activityPriority : activity_hp_edit
        };

        UpdateActivity(updatedActivityId, actObj, function (ret){
            console.log(ret);
            if(ret != -1){
                console.log("coming..")
                $('#activity_edit_name, #activity_edit_description').val('');
                $('input:radio[name=upd_status]:checked').prop('checked', false);
                $('#highpriority_edit').prop("checked", false);

                GetActivities(userId, function (data){
                    DisplayActivityList(data);
                });

                notif({msg : "Activity updated successfully!!", type : "success"});
            }
            else{
                notif({msg : "Activity not updated. Try again.", type : "warning"});
                return false;
            }
        });
    }
    else{
        notif({msg : "Login again and try..!!", type: 'warning'});
        return false;
    }
});

//5. DELETE ACTIVITY
//delete activity click function 
$('#delete_activity_btn').click(function(){
    if(localStorage.getItem('userDetails') != null && localStorage.getItem('userId') != null){
        
        DeleteActivity(userId, updatedActivityId, function(ret){

            if(ret != 1){
                $('#activity_name, #activity_description').val('');
                $('input:radio[name=status]:checked').prop('checked', false);
                $('#highpriority').prop("checked", false);

                GetActivities(userId, function (data){
                    DisplayActivityList(data);
                });

                notif({msg : "Activity Deleted Successfully!!", type : "success"});
            }
            else{
                notif({msg : "Activity not deleted. Try again.", type : "warning"});
                return false;
            }
        });
    }
    else{
        notif({msg : "Login again and try..!!", type: 'warning'});
        return false;
    }
});

// 6. Edit User Data
function EditProfile(){
    // console.log(userDetails);
    $('#user_first_name').val("");
    $('#user_last_name').val("");
    $('#user_mail').val("");
    $('#user_password').val("");
    $('#user_confirm_password').val("");

    if(userDetails != null && userDetails.length > 0){
        $('#user_first_name').val(userDetails[0].firstName);
        $('#user_last_name').val(userDetails[0].lastName);
        $('#user_mail').val(userDetails[0].mail);
        $('#editUserModal').modal('show');
    }
    else{
        notif({msg : 'User not verified. Log in again.', type: 'warning'});
        return false;
    }
}

// change user detail update
$('#edit_user_save_btn').click(function(){
    var isValid = true, message, pwd;

    if($("#user_first_name").val() == ""){
        message = "Enter first name";
        isValid = false;
    }
    else if($("#user_last_name").val() == ""){
        message = "Enter last name";
        isValid = false;
    }
    else if($("#user_mail").val() == ""){
        message = "Enter mail id";
        isValid = false;
    }
    else if(($('#user_password').val() != "" && $('#user_confirm_password').val() != "") 
            && 
            ($("#user_password").val() != $("#user_confirm_password").val())) {
        message = "Passwords do not match. Check and retry";
        isValid = false;
    }
    else if(($('#user_password').val() != "" && $('#user_confirm_password').val() == "") || 
        ($('#user_password').val() == "" && $('#user_confirm_password').val() != "")){
        message = "To change password, enter password and confirm password"
        isValid = false;
    }

    if($('#user_password').val() == "" && $('#user_confirm_password').val() == "")
        pwd = userDetails[0].password;
    else
        pwd = $("#user_password").val();

    if(isValid){
        var newUserDetail = {
            'activityUserId' : userId,
            'firstName' : $("#user_first_name").val(),
            'lastName' : $("#user_last_name").val(),
            'mail' : $("#user_mail").val(),
            'password' : pwd,
        };
        
        UpdateUserDetail(userId, newUserDetail, function(ret){
            if(ret != 1){
                GetUserById(userId, function(data){
                    if(data != -1){
                        console.log(data);
                        localStorage.removeItem("userDetails");
                        localStorage.removeItem("userId");

                        localStorage.setItem("userDetails", JSON.stringify(data.userData));
                        localStorage.setItem("userId", JSON.stringify(data.userData[0]._id));

                        userDetails = JSON.parse(localStorage.getItem('userDetails')); 
                        notif({msg : "User detail updated successfully", type: "success"});
                    }
                    else{
                        return false;
                    }
                });
            }
            else{
                notif({msg : "User details not updated. Try again.", type : "warning"});
                return false;
            }

        });
    }
    else{
        notif({msg: message, type: "warning"});
        isValid = false;
        return false;
    }
});

// 7. Logout from app
function Logout(){
    localStorage.removeItem("userDetails");
    localStorage.removeItem("userId");
    window.location = "login.html";
    return false;
}
