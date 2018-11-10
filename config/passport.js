JwtStrategy = require('passport-jwt').Strategy;
ExtractJWT = require('passport-jwt').ExtractJwt;
User = require('../model/users');
config = require('./config');

module.exports = (passport) => {
    var opts = {};
    opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{

        // console.log(jwt_payload);

        User.getUserByID(jwt_payload._id, (err,user) => {
            if (err) {
                return done(err,false);
            }
            if (user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        })
    }))
}