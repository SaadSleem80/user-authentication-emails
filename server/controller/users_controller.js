const express = require("express");
const User = require("../model/user_model");
const users_function = require("../general JS/users_function");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// Routers_Get
const index = (req, res) => {
  res.render("index");
};
const signin_get = (req, res) => {
  res.render("./users/signin");
};
const signup_get = (req, res) => {
  res.render("./users/signup");
};
const content_get = (req, res) => {
  res.render("content.ejs");
};
const verifyEmail_view = (req, res) => {
  res.render("./users/verifyedEmail");
};

const logout = (req, res) => {
  res.cookie("loggedin", "", { maxAge: 1 });
  res.redirect("/");
};

// verify user email
const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    jwt.verify(token, "saad secret", async (err, decodedtToken) => {
      if (err) {
        res.send("this link is expired");
      } else {
        await User.findOneAndUpdate(
          { _id: decodedtToken.id },
          { validation: true }
        );
        res.redirect("/signin");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// Reset user password
const resetPassowrd_get = (req, res) => {
  res.render("./users/resetPassword");
};

const resetPassowrd_verify = (req, res) => {
  const { token } = req.params;
  try {
    jwt.verify(token, "saad secret", (err, decodedtToken) => {
      if (err) {
        res.send("the link Expired");
      } else {
        res.render("./users/resetPassword2", { id: decodedtToken.id });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
// Routers_POST
const signup_Post = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = users_function.createToken(user._id);
    users_function.sendVerfiyEmail(user.email, token);
    res.status(200).json({ user });
  } catch (err) {
    const error = users_function.handelErrors(err);
    res.status(400).json({ error });
  }
};

const signin_Post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await users_function.login_user(email, password);
    const token = await users_function.createToken(user.id);
    res.cookie("loggedin", token, { maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ user });
  } catch (err) {
    const error = users_function.handelErrors(err);
    res.status(400).json({ error });
  }
};

const resetPassword_Post1 = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = users_function.createToken(user._id);
      users_function.resetPasswordEmail(user.email, token);
      res.json(user);
    } else {
      throw Error("this email is invalid");
    }
  } catch (err) {
    const error = users_function.handelErrors(err);
    res.status(400).json({ error });
  }
};

const resetPassword_Post2 = async (req, res) => {
  try {
    let { password1, password2, id } = req.body;
    if (password1 == password2) {
      const salt = await bcrypt.genSalt();
      password1 = await bcrypt.hash(password1, salt);
      await User.updateOne({ _id: id }, { password: password1 });
      res.json({ success: true });
    } else {
      throw Error("the password is not the same");
    }
  } catch (err) {
    const error = users_function.handelErrors(err);
    console.log(err);
    res.json({ error });
  }
};

const verfiyEmail_Post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = users_function.createToken(user._id);
        users_function.sendVerfiyEmail(user.email, token);
        res.status(200).json({ user });
      } else {
        throw Error("the password is not correct");
      }
    } else {
      throw Error("this email is not correct");
    }
  } catch (err) {
    const error = users_function.handelErrors(err);
    res.status(400).json({error});
  }
};

module.exports = {
  index,
  signin_get,
  signup_get,
  content_get,
  verifyEmail_view,
  verifyEmail,
  signup_Post,
  signin_Post,
  logout,
  resetPassowrd_get,
  resetPassword_Post1,
  resetPassowrd_verify,
  resetPassword_Post2,
  verfiyEmail_Post,
};
