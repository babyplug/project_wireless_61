express     = require('express');
app         = express();
bodyParser  = require('body-parser');
morgan      = require('morgan');
mongoose    = require('mongoose');
passport 	= require('passport');
config      = require('./config/config');
routes 		= require('./route/routes');
secureRoute = require('./route/secure_routes');
session     = require('express-session');
cookeyParser    = require('cookie-parser');

// =======================
// configuration
// =======================
// server setting
var port = process.env.PORT || 8000;

// connect databse
mongoose.connect(config.database,{useNewUrlParser:true});

// application variables
app.set('superSecret', config.secret);
// require('./authen');
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// config for body-parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// log request
app.use(morgan('combined'));

// =======================
// routes
// =======================
app.use('/', routes);
app.use('/auth', passport.authenticate('jwt',{ session : false }), secureRoute );
app.use((req,res) => {
    res.status(404).render('notfound');
})

// =======================
// start the server
// =======================
app.listen(port);
console.log('started http://localhost:' + port + '/');
