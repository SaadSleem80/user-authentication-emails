const express = require("express");
const router = express.Router();
const users_controller = require("../controller/users_controller");
const users_middelWare = require("../middelware/users_middelware");
const user = require("../model/user_model");

// Routers_Get
router.get("*", users_middelWare.currentUser);

router.get("/", users_controller.index);

router.get("/signup", users_controller.signup_get);

router.get("/signin", users_controller.signin_get);

router.get(
  "/content",
  users_middelWare.requiredAuth,
  users_controller.content_get
);

router.get("/verifyEmail", users_controller.verifyEmail_view);

router.get("/verfiy/:token", users_controller.verifyEmail);

router.get("/logout", users_controller.logout);

router.get("/reset", users_controller.resetPassowrd_get);

router.get("/reset/password/:token", users_controller.resetPassowrd_verify);

// Routers_POST
router.post("/signup", users_controller.signup_Post);

router.post("/signin", users_controller.signin_Post);

router.post("/reset/password", users_controller.resetPassword_Post1);

router.post("/reset/password2", users_controller.resetPassword_Post2);

router.post('/verfiy' , users_controller.verfiyEmail_Post)

module.exports = router;
