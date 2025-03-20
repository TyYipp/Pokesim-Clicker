const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Required for password hashing
const slugify = require("slugify");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Please enter a name",
  },
  slug: String,
  email: {
    type: String,
    trim: true,
    required: "Please enter an email",
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: "Please enter a password",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Password hashing before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash password if it's modified
  this.password = await bcrypt.hash(this.password, 10); // Hash password with a salt factor of 10
  next();
});

// Password matching method for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with the hashed password
};

// Slugify the name before saving to create a URL-friendly version of the name
userSchema.pre("save", function (next) {
  if (!this.isModified("name")) {
    return next();
  }
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("User", userSchema);
