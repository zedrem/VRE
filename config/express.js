var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
	multiparty = require('connect-multiparty'),
	flash = require('connect-flash');

module.exports = function(){
	var app = express();

	if(process.env.NODE_ENV === 'development'){
		app.use(morgan('dev'));
	} else if(process.env.NODE_ENV === 'production'){
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(multiparty());

	//console.log(config.sessionSecret);
	
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
	}));

	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/accounts.server.routes.js')(app);
	require('../app/routes/administrators.server.routes.js')(app);
	require('../app/routes/clinicians.server.routes.js')(app);
	require('../app/routes/clinicianspatients.server.routes.js')(app);
	require('../app/routes/patients.server.routes.js')(app);
	require('../app/routes/categories.server.routes.js')(app);
	require('../app/routes/repository.server.routes.js')(app);
	require('../app/routes/goals.server.routes.js')(app);
	require('../app/routes/treatments.server.routes.js')(app);
	require('../app/routes/information.server.routes.js')(app);
	require('../app/routes/treatmentcontent.server.routes.js')(app);

	app.use(express.static('./public'));

	return app;
};