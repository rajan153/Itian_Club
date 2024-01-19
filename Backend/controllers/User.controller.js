const Student = require("../models/Student.model");
const Otp = require("../models/Otp.model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender.utils");
const otpTemplate = require("../mails/emailVerificationTemplate");

// Send Otp

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await Student.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    // Check otp is unique or not
    // REMEBER: This code is not optimised because it going to Database to check the entry
    // again and again
    const result = await Otp.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
      });
    }

    const otpPaylaod = { email, otp };
    const otpBody = await Otp.create(otpPaylaod);
    await mailSender(email, "One Time Password", otpTemplate(otp));
    res.status(200).json({
      success: true,
      message: `OTP send successfully. Please check your ${email} email `,
      otp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "OTP not send successfully.",
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const {
      fullName,
      department,
      section,
      email,
      year,
      contactNumber,
      crn,
      urn,
      password,
      confirmPassword,
      otp
    } = req.body;

    if (
      !fullName ||
      !department ||
      !section ||
      !email ||
      !year ||
      !contactNumber ||
      !crn ||
      !urn ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Does'nt match both password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not match",
      });
    }

    // user exists or not
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // Find the most recent OTP for the email
    const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(response);
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      fullName,
      contactNumber,
      email,
      crn,
      urn,
      password: hashedPassword,
      profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${fullName}`,
    });

    // return res
    return res.status(200).json({
      success: true,
      student,
      message: "User is registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please SignUp",
    });
  }
};
