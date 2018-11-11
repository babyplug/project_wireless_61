JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;
User = require('../model/users');
config = require('./config');
// require('./local');

module.exports = function(passport){
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    console.log(config.secret);

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload);
        
        User.getUserByID(jwt_payload._id,(err,user)=>{
            console.log(jwt_payload);
            if(err){
                return done(err,false);
            }

            if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        })
    }))
}