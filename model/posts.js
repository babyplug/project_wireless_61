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
    comment : [{
        name : String,
        detail : String
    }]
})

module.exports = mongoose.model('Posts', PostsSchema)

module.exports.addPost = (newPost,callback)=> {
    newPost.save(callback)
}