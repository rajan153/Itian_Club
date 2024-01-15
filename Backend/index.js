const express = require("express");
const app = express();

const dotenv = require("dotenv");
const database = require("./configs/Database")

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