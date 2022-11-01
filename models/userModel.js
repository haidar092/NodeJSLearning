const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Tell us your Name'],
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 15,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please provide us your email'],
    validate: [validator.isEmail, 'Please Enter Validate Eamil'],
  },
  photo: String,

  password: {
    type: String,
    required: [true, 'Please provide us your password'],
    minlength: 8,
    maxlength: 15,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only work when create or save
      validator: function (el) {
        return el === this.password;
      },
      message: 'password are not same',
    },
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
