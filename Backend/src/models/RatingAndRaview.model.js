const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    index: true,
  },
});

module.exports = mongoose.model("RatingAndReviews", ratingAndReviewSchema);
