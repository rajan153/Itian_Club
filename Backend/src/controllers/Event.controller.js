const Event = require("../models/Event.model");
const Student = require("../models/Student.model");
const uploadOnCloudinary = require("../utils/cloudinary");

exports.createEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    let {
      title,
      description,
      date,
      status,
      tag: _tag,
      registrationOpen,
      registrationCloseDate,
      pastEvent,
    } = req.body;

    const tag = JSON.parse(_tag);
    // Validation
    if (
      !title ||
      !description ||
      !date ||
      !tag.length ||
      !status ||
      !registrationOpen ||
      !registrationCloseDate ||
      !pastEvent
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }

    const posterImagePath = req.files?.posterImage[0]?.path;

    const uploadImage = await uploadOnCloudinary(posterImagePath);
    console.log(uploadImage);

    if (!uploadImage) {
      return res.status(404).json({
        success: false,
        message: "Poster is required",
      });
    }

    const newEvent = await Event.create({
      title,
      description,
      posterImage: uploadImage?.url,
      date,
      tag,
      status,
      registrationOpen,
      registrationCloseDate,
      pastEvent,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Event",
    });
  }
};
