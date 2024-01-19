const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender.utils");
const { emailTemplate } = require("../mails/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// Function for Sending Email

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification for Email",
      emailTemplate(otp)
    );
  } catch (error) {
    console.error("Error in send verification function in otp model", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  if (this.isnew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("Otp", otpSchema);
