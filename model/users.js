Schema = require('mongoose').Schema
bcrypt = require('bcrypt')
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
        require : true
    }
})

UserSchema.pre('save', function(next) {
	user = this

	if (!user.isModified('password'))
		return next()

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next (err)

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next (err)

			user.password = hash
			next()
		})
	})
})

UserSchema.methods.comparePassword = function(candidate, cb) {
	bcrypt.compare(candidate, this.password, function(err, isMatch) {
		if (err) return cb (err)
		cb(null, isMatch)
	})
}


module.exports = mongoose.model('Users', UserSchema)
