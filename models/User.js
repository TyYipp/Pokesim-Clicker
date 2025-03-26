const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Please enter a name',
    trim: true,
  },
  email: {
    type: String,
    required: 'Please enter an email',
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: 'Please enter a password',
  },
});

// Password hashing before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password matching method for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
