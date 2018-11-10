express     = require('express');
app         = express();
bodyParser  = require('body-parser');
morgan      = require('morgan');
mongoose    = require('mongoose');
jwt         = require('jsonwebtoken');
passport 	= require('passport');
config      = require('./config/config');
routes 		= require('./route/routes');
secureRoute = require('./route/secure_routes');

// =======================
// configuration
// =======================
// server setting
var port = process.env.PORT || 8000;

// connect databse
mongoose.connect(config.database,{useNewUrlParser:true});

// application variables
app.set('superSecret', config.secret);
require('./authen');
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// config for body-parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// log request
app.use(morgan('combined'));

// =======================
// routes
// =======================
app.use('/', routes);
app.use('/api', passport.authenticate('jwt', { session : false }), secureRoute );

// =======================
// start the server
// =======================
app.listen(port);
console.log('started http://localhost:' + port + '/');
