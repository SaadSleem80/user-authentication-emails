const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/user_model");
const bcrypt = require("bcrypt");
require("dotenv").config();

// global functions
const handelErrors = (err) => {
  const errors = { email: "", password: "", username: "", valditaion: "" };
  if (err.code === 11000) {
    errors.email = "this email is already exist";
    return errors;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  if (err.message === "this email is not correct") {
    errors.email = "this email is not correct";
  }
  if (err.message === "please verify your account") {
    errors.valditaion = "please verify your account";
  }
  if (err.message === "the password is not correct") {
    errors.password = "the password is not correct";
  }
  if (err.message === "the password is not the same") {
    errors.password = "the password is not the same";
  }
  if (err.message === "this email is invalid") {
    errors.email = "this email is invalid";
  }
  if (err.message === "please type password") {
    errors.password = "please type password";
  }

  return errors;
};

// create token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "saad secret", { expiresIn: maxAge });
};

// send verfiy email
const sendVerfiyEmail = async (email, token) => {
  try {
    const transporte = nodemailer.createTransport({
      host: `${process.env.CYCLIC_URL}`,
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: "txwkimzeldtjseao",
      },
    });
    const mailOptions = {
      from: `${process.env.EMAIL}`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h1>Hi there welcome to my user auth</h1>
        <h2>please click on the link below to verify your email</h2>
        <a href='${process.env.CYCLIC_URL}/verfiy/${token}'>Click Me !!</a>
        `,
    };
    transporte.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("email sent");
        res.json({ success: true });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const login_user = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    if (user.validation == true) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      } else {
        throw Error("the password is not correct");
      }
    } else {
      throw Error("please verify your account");
    }
  } else {
    throw Error("this email is not correct");
  }
};

const resetPasswordEmail = async (email, token) => {
  try {
    const transporte = nodemailer.createTransport({
      host: `${process.env.CYCLIC_URL}`,
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: "txwkimzeldtjseao",
      },
    });
    const mailOptions = {
      from: `${process.env.EMAIL}`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h1>Hi there welcome to my user auth</h1>
        <h2>please click on the link below to reset your password</h2>
        <a href='${process.env.CYCLIC_URL}/reset/password/${token}'>Click Me !!</a>
        `,
    };
    transporte.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ success: true });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  handelErrors,
  createToken,
  sendVerfiyEmail,
  login_user,
  resetPasswordEmail,
};
