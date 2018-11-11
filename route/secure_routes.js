express = require('express');
apiRoutes = express.Router();
passport = require('passport');
Post = require('../model/posts');
ObjectId = require('mongodb').ObjectId;

// GET(http://localhost:8000/api/)
apiRoutes.get('', function(req, res) {
  res.json({ message: 'Welcome to API routing'});
  
});

// GET(http://localhost:8000/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if (err) throw err;
    res.json(users);
  });
}); 

//profile is below here
apiRoutes.delete('/profile', (req, res, next) => {
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


// change password below here
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

// all path /post below here
apiRoutes.get('/post', (req, res, next) => {
  res.render('post');
})

apiRoutes.post('/post', (req, res, next) => {
  let newPost = new Post({
    author: req.body.author,
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
  query = {author: req.body.author}
  id = req.body.id;
  newpost = { name: req.body.name, detail: req.body.detail}
  Post.findById(id, (err, post) =>{
    if(query.author == post.author){
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
  query = {author: req.body.author}
  id = req.body.id;
  Post.findById(id, (err, post) =>{
    if(query.author == post.author){
      Post.findByIdAndRemove(id,(err) => {
        return res.json({
          success: true,
          message: 'delete post success! '
        })
      })
    }
  })
})

//all path /like here
apiRoutes.put('/like', (req, res, next) => {
  Post.findById(
  req.body.id,(err, data) => {
    // res.json({data})
    if(!checkexists(data.like_by, req.body.username)){
      Post.updateOne({
        '_id' : ObjectId(`${req.body.postid}`)
      },{
        $push: {
          'like_by': req.body.username
        }
      }, (err, data) => {
        if(err) throw (err);
        console.log(data)
        res.json({
          success: true,
          message: 'like'
        })
      })
    } else {
      Post.updateOne({
        '_id': ObjectId(`${req.body.postid}`)
      }, {
        $pull: {
          like_by: req.body.username
        }
      }, (err, data) => {
        if(err) throw err;
        console.log(data)
        res.json({
          success: true,
          message: 'unlike'
        })
      })
    }
  })
})

checkexists = (like_by, username) => {
  check = false;
  like_by.forEach(element => {
    if(username == element) {
      check = true
    }
  })
  return check;
}

//all path /comment below here
//creat comment
apiRoutes.post('/comment', (req, res, next) => {
  name = req.body.name, detail = req.body.detail;
  Post.updateOne(
    {
       _id: req.body.postid
    },
    {
     $push: {
       comment: {
          name_comment: name,
          detail_comment: detail     
       }
     } 
    },
      (err, data) =>{
        if(err) throw err;
        res.json({
          success: true,
          message: 'comment success'
        })
      }
    )
})

//edit comment
apiRoutes.put('/comment', (req, res, next) => {
  name = req.body.name, newDetail = req.body.detail;
  Post.findById(req.body.postid,(err, post) => {
    // res.json(post.comment)
    post.comment.forEach(element => {
      if(element._id == req.body.commentid){
        return res.json(element)
        // Post.updateOne(
        //   {
        //     _id: req.postid
        //   },
        //   {
        //     $set: {
        //       comment: {
        //           name_comment: name,
        //           detail_comment: newDetail
        //       }
        //     }
        //   })
      }
    })
    res.json({
      success: false,
      message: 'comment not found'
    })
  })
})

//delete comment
apiRoutes.delete('/comment', (req, res, next) => {
  
})

module.exports = apiRoutes;