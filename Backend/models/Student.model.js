const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    crn: {
      type: Number,
      required: true,
      trim: true,
    },
    urn: {
      type: Number,
      required: true,
      trim: true,
    },
    token: {
      type: String,
    },
    event: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ["Admin", "Student"],
      default: Student,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
