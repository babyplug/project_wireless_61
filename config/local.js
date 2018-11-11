passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
User = require('../model/users');

module.exports = () => {
    passport.use(new LocalStrategy( (username, password, done) => {

    }))
}