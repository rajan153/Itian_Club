const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  ],
  present: {
    type: Boolean,
    default: false,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
