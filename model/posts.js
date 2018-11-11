Schema = require('mongoose').Schema
bcrypt = require('bcryptjs')

PostsSchema = new Schema({
	author: {
		type : String
	},
	name : {
		type : String
    },
    date : {
        type : String
    },
    detail : {
        type : String
    },
    like_by : [{
        type : String
    }],
    comments : [{
        name_comment : String,
        detail_comment : String
    }]
})

module.exports = mongoose.model('Posts', PostsSchema)

module.exports.addPost = (newPost,callback)=> {
    newPost.save(callback)
}