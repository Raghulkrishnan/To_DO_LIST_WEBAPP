const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoute = require('./api/routes/users');
const activityRoute = require('./api/routes/activity');

// cross origin
app.use((req, res, next) =>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Origin-Headers', 
		'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	
	if(req.method === "OPTIONS"){
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

// mongoose
mongoose.connect('mongodb+srv://rbalasubramanian1_dbUser:'+ process.env.MONGO_ATLAS_PW +
	'@cluster0-x6tpw.mongodb.net/test?retryWrites=true&w=majority',
	{
		useUnifiedTopology : true,
		useNewUrlParser : true
	}
);

// morgan and body parser
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//localhost:3000 page
app.use(express.static(__dirname));
console.log("Directory name : " + __dirname);
// localhost:3000/css page, /images page and /js page
// app.use('/uploads', express.static('/uploads')); //multer
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/js'));

// Routing to the desired file
// NOTE: ROUTES MUST BE AFTER ALL THE CONFIGURATION
app.use('/user', userRoute);
app.use('/activity', activityRoute);

// Errors
app.use((req, res, next) =>{
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((req, res, next) =>{
	const error = new Error('Internal Server Error');
	error.status = 500;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error : {
			message : error.message
		}
	});
});

module.exports = app;