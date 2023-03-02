const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please enter a username"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please enter an email"],
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    require: [true, "please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  validation: {
    type: Boolean,
    default: false,
  },
});

Schema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const user = mongoose.model("user", Schema);

module.exports = user;
