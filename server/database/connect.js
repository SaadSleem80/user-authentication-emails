const mongoose = require('mongoose');
require("dotenv").config();
const connectdb = async () => {
    mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.log("unable to connect to database");
        } else {
          console.log("Connect to Database");
        }
      }
    );
  };
  mongoose.set("strictQuery", false);
module.exports = connectdb;