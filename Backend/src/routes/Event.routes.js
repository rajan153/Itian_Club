const express = require("express");
const router = express.Router();

const { createEvent } = require("../controllers/Event.controller");

const { auth, isAdmin } = require("../middlewares/Auth.middleware");
const upload = require("../middlewares/Multer.middleware");

// **************************************************************
//                  Events routers For Admin
// **************************************************************

// User Login
router.post(
  "/createEvent",
  upload.fields([{ name: "posterImage", maxCount: 1 }]),
  auth,
  isAdmin,
  createEvent
);

module.exports = router;
