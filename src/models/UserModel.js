const mongoose = require('mongoose')


const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: {
		type: String,
		default: "10",
		require: true
	},
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	}	
}, { timestamps: true })


const User = mongoose.model('User', UserSchema)

module.exports = User