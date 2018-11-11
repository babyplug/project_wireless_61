Schema = require('mongoose').Schema;
bcrypt = require('bcryptjs');
SALT_WORK_FACTOR = 10

UserSchema = new Schema({
	username : {
		type : String,
		required : true
	},
	password : {
		type : String,
		required : true
    },
    name: {
        type : String,
        require : true
    },
    email: {
        type : String,
		require : true,
		unique: true
    }
})

const User = module.exports = mongoose.model('Users', UserSchema)

// UserSchema.pre('save', function(next) {
// 	user = this
// 	if (!user.isModified('password'))
// 		return next()
// 	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
// 		if (err) return next (err)
// 		bcrypt.hash(user.password, salt, function(err, hash) {
// 			if (err) return next (err)
// 			user.password = hash
// 			next()
// 		})
// 	})
// })

module.exports.addUser = (newUser, callback) => {
	const query = {username: newUser.username}
	User.countDocuments(query, (err, count) => {
		if(count > 0){
			callback(null,count);
		}else {
			bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
				if (err) return err;
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if(err) return err;
					newUser.password = hash;
					newUser.save(callback);
				})
			})
		}
	})
}

module.exports.getUserByID = (id, callback) => {
	User.findById(id, callback);
}

module.exports.getUserByUsername = (candadidateUsername, callback) => {
	User.findOne({username: `${candadidateUsername}`},callback);
}

module.exports.enHash = (password ,callback) => {
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return err;
		bcrypt.hash(password, salt, (err, hash) => {
			if(err) return err;
			password = hash;
			callback(null, password)
		})
	})
}

module.exports.updatePassword = (username, password, callback) => {
	User.updateOne({
		'username' : username 
	}, {
		$set : {password: password}
	},callback)
}

module.exports.comparePassword = function(candidate, hash, callback) {
	bcrypt.compare(candidate, hash,(err, isMatch) => {
		if (err) throw err;
		callback(null,isMatch)
	})
}


