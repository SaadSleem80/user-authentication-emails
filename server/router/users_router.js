const express = require("express");
const router = express.Router();
const users_controller = require("../controller/users_controller");

// Routers_Get
router.get("/", users_controller.index);

router.get("/signup", users_controller.signup_get);

router.get("/signin", users_controller.signin_get);

router.get("/content", users_controller.content_get);

router.get("/verifyEmail", users_controller.verifyEmail_view);

router.get("/verfiy/:token", users_controller.verifyEmail);
// Routers_POST
router.post("/signup", users_controller.signup_Post);

module.exports = router;
