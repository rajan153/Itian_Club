const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    posterImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    studentRegister: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    studentPresent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReviews",
      },
    ],
    tag: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
    },
    registrationOpen: Boolean,
    registrationCloseDate: Boolean,
    pastEvent: Boolean,
    certificates: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        filePath: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
