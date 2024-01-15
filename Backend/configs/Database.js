const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(console.log("Database Connected Successfully"))
    .catch((err) => console.log("Database connection problem", err));
};
