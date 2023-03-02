const express = require("express");
const User = require("../model/user_model");
const users_function = require("../general JS/users_function");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
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

// verify user email
const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    jwt.verify(token, "saad secret", async (err, decodedtToken) => {
      if (err) {
        res.send('this link is expired')
      } else {
        await User.findOneAndUpdate(
          { _id: decodedtToken.id},
          { validation: true }
        );
        res.redirect("/signin");
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

const signin_Post = async (req,res) => {
  const {email, password} = req.body;
  try{ 
    const user = await users_function.login_user(email , password);
    const token = await users_function.createToken(user.id);
    res.cookie('loggedin' , token, {maxAge: 3 * 24 * 60 * 60 * 1000});
    res.status(200).json({user});
  } catch(err) {
    const error = users_function.handelErrors(err);
    res.status(400).json({error});
  }
}


module.exports = {
  index,
  signin_get,
  signup_get,
  content_get,
  verifyEmail_view,
  verifyEmail,
  signup_Post,
  signin_Post
};
