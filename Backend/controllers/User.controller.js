const Student = require("../models/Student.model");
const Otp = require("../models/Otp.model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender.utils");
const otpTemplate = require("../mails/emailVerificationTemplate");
const { passwordUpdated } = require("../mails/passwordUpdateTemplate");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Email Validation
    const allowedDomainRegex = /^[a-zA-Z0-9._-]+@gndec\.ac\.in$/;
    if (!allowedDomainRegex.test(email)) {
      return res.status(401).json({
        success: false,
        message: "Enter your college email",
      });
    }

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
      otp,
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

    // Email Validation
    const allowedDomainRegex = /^[a-zA-Z0-9._-]+@gndec\.ac\.in$/;
    if (!allowedDomainRegex.test(email)) {
      return res.status(401).json({
        success: false,
        message: "Enter your college email",
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

exports.login = async (req, res) => {
  try {
    // Get data from req.body
    const { email, password } = req.body;

    // validation data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // checks user exits or not
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not register. Please SignUp",
      });
    }

    // generate JWT, after matching password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
          accountType: user.accountType,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed, Please try again",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await Student.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
      // If new password and confirm new password do not match, return a 400 (Bad Request) error
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await Student.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password updated successfully",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.fullName}`
        )
      );
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
