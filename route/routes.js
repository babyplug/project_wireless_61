express = require('express');
passport = require('passport');
jwt = require('jsonwebtoken');
config = require('./config');
apiRoutes = express.Router();

apiRoutes.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {     
try {
      	if(err || !user){
        		const error = new Error('An Error occured')
        		return next(error);
      	}
      	req.login(user, { session : false }, async (error) => {
        		if( error ) return next(error)
               	const body = { _id : user._id, username : user.username };
        token = jwt.sign({ user : body },config.secret);
        //Send back the token to the user
        return res.json({ token });
      });     } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = apiRoutes;
