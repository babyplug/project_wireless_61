express = require('express');
apiRoutes = express.Router();
passport = require('passport');
Post = require('../model/posts');


//set
require('../config/passport')(passport);

// GET(http://localhost:8000/api/)
apiRoutes.get('', function(req, res) {
  res.json({ message: 'Welcome to API routing'});
  
});

apiRoutes.get('/changepassword', (req,res,next) => {
  res.render('changepassword');
})

apiRoutes.post('/changepassword', (req, res) => {
  let username = req.body.username;
  let old_password = req.body.old_password;
  let new_password = req.body.new_password; 

  // res.json({
  //   username: username,
  //   old: old_password,
  //   new: new_password
  // })
  
  User.getUserByUsername(username,(err, user) => {
    if (err) throw err;
    // res.json({
    //   user: user
    // })
    if (!user) {
      return res.json({
        success: false,
        message: 'username ไม่ถูกต้องหรือไม่มี username นี้'
      })
    }

    User.comparePassword(old_password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        // return res.json({
        //   success: true,
        //   message: 'รหัสผ่านตรงกัน'
        // })
        
        User.enHash(new_password, (err, password) => {
          if (err) throw err;
          new_password = password;
          User.updatePassword(username, new_password, (err) => {
              if (err) throw err;
              res.json({
                success: true,
                message: 'เปลี่ยนรหัสผ่านเรียบร้อย'
              })
          })
        })

      }else {
        return res.json({
          success: false,
          message: 'รหัสผ่านเดิมไม่ถูกต้อง'
        })
      }
    })

  })
});

// GET(http://localhost:8000/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if (err) throw err;
    res.json(users);
  });
});

apiRoutes.get('/post', (req, res, next) => {
  res.render('post');
})

apiRoutes.post('/post', (req, res, next) => {
  let newPost = new Post({
    username: req.body.username,
    name: req.body.name,
    detail: req.body.detail
  })

  Post.addPost(newPost, (err) => {
    if(err) next(err);
    return res.json({
      success: true,
      message: 'เผยแพร่สูตรเรียบร้อยแล้ว'
    })
  })
})

apiRoutes.put('/post', (req, res, next) => {
  query = {username: req.body.username}
  id = req.body.id;
  newpost = { name: req.body.name, detail: req.body.detail}
  Post.findById(id, (err, post) =>{
    if(query.username == post.username){
      Post.findByIdAndUpdate(id,{ $set: newpost},(err) => {
        if(err) next(err);
        return res.json({
          success: true,
          message: 'update post success! '
        })
      })
    }
  })
})

apiRoutes.delete('/post', (req, res, next) => {
  query = {username: req.body.username}
  id = req.body.id;
  Post.findById(id, (err, post) =>{
    if(query.username == post.username){
      Post.findByIdAndRemove(id,(err) => {
        return res.json({
          success: true,
          message: 'delete post success! '
        })
      })
    }
  })
})

apiRoutes.delete('/deleteuser', (req, res, next) => {
  id = req.body.id;
  // res.json({
  //   id: req.body.id
  // })
  User.getUserByID( (id), (err, user, next) => {
    if(err) return err;
    if(!user) {
      return res.json({message: 'not found !'})
    }else {
      if(user.id = id){
        // return res.json({
        //   username: user.username
        // }) 
        User.findByIdAndRemove(id,(err)=>{
          if (err) next(err);
          res.json({
            success: true,
            message: 'delete user success'
          })
        })
      }else {
        return res.json({
          success: false,
          message: ''
        })
      }  
    }
  })
})

apiRoutes.post('/like', (req, res, next) => {

})

apiRoutes.put('/like', (req, res, next) => {

})

apiRoutes.delete('/like', (req, res, next) => {

})

apiRoutes.post('/comment', (req, res, next) => {

})

apiRoutes.put('/comment', (req, res, next) => {

})

apiRoutes.delete('/comment', (req, res, next) => {

})
module.exports = apiRoutes;