const mongoose = require('mongoose')
const Schema = mongoose.Schema

UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('User', UserSchema)