const express = require("express");
const router = express.Router();

const { sendOtp, signUp } = require("../controllers/User.controller");

const { auth } = require("../middlewares/Auth.middleware");

// **************************************************************
//                  Authentication routers For Students
// **************************************************************

// User Login
// router.post("/login", login);
// User SignUp
router.post("/signup", signUp);
// Sending Otp to User's email
router.post("/sendotp", sendOtp);

module.exports = router;
