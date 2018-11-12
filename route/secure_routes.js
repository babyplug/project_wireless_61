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
        return res.status(404).json({
          success: false,
          message: 'no user found'
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

  User.getUserByUsername(username,(err, user) => {
    if (err) throw err;

    if (!user) {
      return res.json({
        success: false,
        message: 'username ไม่ถูกต้องหรือไม่มี username นี้'
      })
    }

    User.comparePassword(old_password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {

        User.enHash(new_password, (err, password) => {
          if (err) throw err;
          new_password = password;
          User.updatePassword(username, new_password, (err) => {
              if (err) throw err;
              res.status(201).json({
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
    detail: req.body.detail,
    date: getdate()
  })

  Post.addPost(newPost, (err,data) => {
    if(err) next(err);
    // res.json(data)
    res.status(201).json({
      success: true,
      message: 'เผยแพร่สูตรเรียบร้อยแล้ว'
    })
  })
})

apiRoutes.put('/post', (req, res, next) => {
  query = {author: req.body.author}
  postid = req.body.postid;
  newpost = { name: req.body.name, detail: req.body.detail}
  Post.findById(postid, (err, post) =>{
    if(post != null && query.author == post.author){
      Post.findByIdAndUpdate(postid,{ $set: newpost},(err,data) => {
        if(err) next(err);
        res.status(201).json({
          success: true,
          message: 'update post success! '
        })
      })
    }else{
      res.status(403).json({
        success: false,
        message: 'you have no permission to edit post! '
      })
    }
  })
})

apiRoutes.delete('/post', (req, res, next) => {
  query = {author: req.body.author}
  postid = req.body.postid;
  Post.findById(postid, (err, post) =>{
    if(err) throw err;
    if(post == null){
      res.status(404).json({
        success: false,
        message: 'post has been deleted'
      })
      // res.json({post: post})
    }else if(post != null && query.author == post.author){
      Post.findByIdAndRemove(postid,(err,data) => {
        return res.json({
          success: true,
          message: 'delete post success! '
        })
        // res.json(data)
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
        res.status(201).json({
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
       comments: {
          name_comment: name,
          detail_comment: detail     
       }
     } 
    },
      (err, data) =>{
        if(err) throw err;
        if(!data.nModified){
          res.status(204).json({
            success: false,
            message: 'comment not success'
          })
        }else {
          res.status(201).json({
            success: true,
            message: 'create comment'
          })
        }
      }
    )
})

//edit comment
apiRoutes.put('/comment', (req, res, next) => {
  name = req.body.name, newDetail = req.body.detail;
  // async index;
  // Post.findById(req.body.postid,(err, post) => {
  //   post.comments.forEach((element, index)=> {
  //     if(req.body.commentid == element._id){
          
  //     }
  //   })
  // })
  Post.updateOne(
    {
       _id: req.body.postid
    },
    {
     $set: {
       comments: {
        name_comment: name,
        detail_comment: newDetail
       }
     } 
    },
    (err, data) =>{
        if(err) throw err;
        if(!data.nModified){
          res.status(204).json({
            success: false,
            message: 'not found comment'
          })
        }else {
          res.json({
            success: true,
            message: 'update comment'
          })
        }
    }
   )

})

//delete comment
apiRoutes.delete('/comment', (req, res, next) => {
  name = req.body.name, detail = req.body.detail;
  Post.updateOne(
    {
       _id: req.body.postid
    },
    {
     $pull: {
       comments: {
         _id: req.body.commentid
       }
     } 
    },
      (err, data) =>{
        if(err) throw err;
        if(!data.nModified){
          res.status(404).json({
            success: false,
            message: 'not found comment'
          })
        }else{
          res.json({
            success: true,
            message: 'delete comment success'
          })
        }

      }
   )
})

function getdate() {
  var date = new Date().toISOString().
  replace(/T/, ' ').
  replace(/\..+/, '');
  return date;
}

// {
//   "n": 1,
//   "nModified": 1,
//   "ok": 1
// }
module.exports = apiRoutes;