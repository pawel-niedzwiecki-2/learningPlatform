// Dependencies import
const bcrypt = require('bcrypt')
require('dotenv').config()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// i validate email
const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

// Create Schema for Users
const schemaUsers = new Schema(
  {
    email: {
      index: true,
      trim: true,
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'err required'],
      validate: [validateEmail, 'err valid'],
    },
    salt: { type: String, trim: true },
    level: { type: Number, default: 0 },
    avatar: { type: Schema.Types.ObjectId, ref: 'file' },
    password: { type: String, required: [true, 'err password'] },
  },
  {
    timestamps: true, // created_at / updated_at
  }
)

schemaUsers.pre('save', async function (next) {
  const newSalt = await bcrypt.genSalt(Number(process.env.SALTROUNDS))
  const hash = await bcrypt.hash(this.password, newSalt)
  this.salt = newSalt
  this.password = hash
  next()
})

// Export Schama and Create model for Lectures
module.exports = mongoose.model('user', schemaUsers)
