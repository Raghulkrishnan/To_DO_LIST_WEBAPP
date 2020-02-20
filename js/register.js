//go back to login button click function will navigate the page back to the login screen
$('#reg_btn_login').click(function(){
	notif({msg: "Login page..", type: "warning"});
	setTimeout(function(){
		window.location = "login.html";
	}, 500);
});

// Register function when sign up button is clicked
function Register(){

	var isValid = true, message;

	if($("#register_firstName").val() == ""){
		message = "Enter first name";
		isValid = false;
	}
	else if($("#register_lastName").val() == ""){
		message = "Enter last name";
		isValid = false;
	}
	else if($("#register_mail").val() == ""){
		message = "Enter username";
		isValid = false;
	}
	else if($("#register_pwd").val() == ""){
		message = "Enter password";
		isValid = false;
	}
	else if($("#register_confirmPwd").val() == ""){
		message = "Enter confirm password";
		isValid = false;
	}
	else if($("#register_pwd").val() != $("#register_confirmPwd").val()){
		message = "Passwords do not match. Check and retry";
		isValid = false;
	}

	if(isValid){

		var registrationObj = {
			'firstName' : $("#register_firstName").val(),
			'lastName' : $("#register_lastName").val(),
			'mail' : $("#register_mail").val(),
			'password' : $("#register_pwd").val(),
		};

		RegisterUser(registrationObj, function(data){

			if(data != -1){
				notif({msg: "User created succefully", type: "success"});
				setTimeout(function(){
					window.location = "login.html";
				}, 500);
			}
			else{
				return false;
			}
		});
	}
	else{
		notif({msg: message, type: 'warning'});
		isValid = false;
	}
	return isValid;
}

function ShowHidePassword(fieldName, eyeToggle) {
    if ($("#" + eyeToggle).hasClass("fa-eye")) {
        $("#" + fieldName).attr("type", "text");
        $("#" + eyeToggle).removeClass("fa-eye").addClass("fa-eye-slash");
    }
    else if ($("#" + eyeToggle).hasClass("fa-eye-slash")) {
        $("#" + fieldName).attr("type", "password");
        $("#" + eyeToggle).removeClass("fa-eye-slash").addClass("fa-eye");
    }
}
