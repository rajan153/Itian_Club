const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    department: {
      type: String,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    anotherEmail: {
      type: String,
      required: true,
      unique: true,
    },
    year: {
      type: Number,
      trim: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    crn: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    urn: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
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
      default: "Student",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
