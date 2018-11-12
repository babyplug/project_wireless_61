express = require('express');
passport = require('passport');
jwt = require('jsonwebtoken');
config = require('../config/config');
apiRoutes = express.Router();
User = require('../model/users');
Post = require('../model/posts');

apiRoutes.get('', (req,res,next) => {
  res.render('index');
})

apiRoutes.get('/login', (req,res) => {
  res.render('login');
})

apiRoutes.get('/register', (req,res) => {
  res.render('signup');
})

apiRoutes.get('/recipe', (req,res) => {
  Post.find({}, (err,posts) => {
    res.json(posts)
  })
})

apiRoutes.get('/recipe/:author', (req,res) => {
  //name = {req.params}
  Post.find(req.params, (err, posts) => {
    if(posts.length == 0){
       res.status(404).render('notfound')
    }else {
       res.json(posts) 
    }
  })
  // res.json(req.params)
})

apiRoutes.get('/recipe/rate', (req,res) => {
  
})

apiRoutes.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      // console.log(user);

      if (!user) {
          return res.json({
              success: false,
              msg: 'อีเมล์หรือรหัสผ่านไม่ถูกต้อง'
          })
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
              const token = jwt.sign(user.toJSON(), config.secret, {
                  expiresIn: 604800
              });

              // return res.redirect('/auth');
              
              localStorage.setItem('isLoggedin', true)

              return res.json({
                  success: true,
                  token: 'Bearer ' + token,
                  user: {
                      id: user._id,
                      name: user.name,
                      username: user.username,
                      email: user.email
                  }
              })
          } else {
              // return res.redirect('/login');
              return res.json({
                  success: false,
                  msg: 'รหัสผ่านไม่ถูกต้อง'
              })
          }
      });
  })
});



apiRoutes.post('/register', (req,res, next) => {
  let newUser = new User({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email
  });

  User.addUser(newUser, (err, count) => {
    if( count > 0){
      res.json({
        success: false,
        message: 'username นี้มีผู้ใช้งานแล้ว'
      })
    }else{
      res.status(201).json({
        success: true,
        message: 'สมัครสมาชิกเสร็จสิ้น'
      })
    }
  })  
})

// apiRoutes.post('/login', async (req, res, next) => {
//   passport.authenticate('login', async (err, user, info) => {     
//     try {
//       if(err || !user){
//       	// const error = new Error('An Error occured')
//       	return next(err);
//       }
//       req.login(user, { session : false }, async (error) => {
//         if( error ) return next(error)
//         const body = { _id : user._id, username : user.username };
//         token = jwt.sign({ user : body },config.secret);
//         //Send back the token to the user
//         return res.json({ token });
//       });     
//     } catch (error) {
//       return next(error);
//     }
//   })(req, res, next);
// });

module.exports = apiRoutes;
