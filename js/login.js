function Register(){
	notif({msg: "Registration page..", type: "warning"});
	setTimeout(function(){
		window.location = "register.html";
	}, 500);
}

function Login(){
	var isValid = true, message;

	if($("#login_username").val() == ""){
		message = "Enter username";
		isValid = false;
	}
	else if($("#login_pwd").val() == ""){
		message = "Enter password";
		isValid = false;
	}

	if(isValid){
		var loginDetails = {
			'username' : $('#login_username').val(),
			'password' : $('#login_pwd').val()
		};

		LoginUser(loginDetails,  function(data){
			if(data != -1){
				console.log(data);
				notif({msg: "Logging in...", type: "success"});

				localStorage.setItem("userDetails", JSON.stringify(data.userData));
				localStorage.setItem("userId", JSON.stringify(data.userData[0]._id));

				setTimeout(function(){
					window.location = "home.html";
				},2000);
			}
			else {
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