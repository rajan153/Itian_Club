const express = require("express");
const app = express();

const userRoutes = require("./routes/User.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./configs/Database");

dotenv.config();
const PORT = process.env.PORT || 4000;

database.connect();

// Default routes
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

// Routes
app.use("/api/v1/auth", userRoutes);
