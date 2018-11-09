Schema = require('mongoose').Schema
bcrypt = require('bcrypt')

PostsSchema = new Schema({
	user_id : {
		type : String
	},
	post_name : {
		type : String
    },
    post_date : {
        type : String
    },
    post_detail : {
        type : String
    },
    post_image : {
        type : String
    },
    like_by : [{
        name : String
    }],
    comment : [{
        name : String,
        detail : String
    }]
})

module.exports = mongoose.model('Posts', PostsSchema)
