const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userContoller = require("../controllers/user");

router.get("/signup",userContoller.renderSignupForm);

router.post("/signup",userContoller.signup);

router.get("/login",userContoller.renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash : true,
}),
userContoller.login);

router.get("/logout",userContoller.logout);

module.exports = router;