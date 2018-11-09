passport = require('passport');
localStrategy = require('passport-local').Strategy;
User = require('./user');
config = require('./config');
JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
ExtractJWT = require('passport-jwt').ExtractJwt;

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField : 'username',
  passwordField : 'password'
}, async (username, password, done) => {
  try {
    //Find the user
    user = await User.findOne({ username });
    if( !user ){
      //If the user isn't found in the database, return a message
      return done(null, false, { message : 'User not found'});
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    const validate = await user.isValidPassword(password);
    if( !validate ){
      return done(null, false, { message : 'Wrong Password'});
    }
    //Send the user information to the next middleware
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
    secretOrKey : config.secret,
    jwtFromRequest : ExtractJWT.fromUrlQueryParameter(config.secret)
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));
