const express = require("express");
const app = express();

const userRoutes = require("./src/routes/User.routes");
const adminRoutes = require("./src/routes/Event.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./src/configs/Database");

dotenv.config();
const PORT = process.env.PORT || 4000;

// Default routes
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});

database.connect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/events", adminRoutes);
