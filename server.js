const express = require("express");
const connectdb = require("./server/database/connect");
const users_router = require("./server/router/users_router");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

// connect to database
connectdb();
// use urlencoded
app.use(express.urlencoded({ extended: false }));
// json
app.use(express.json());
//view engine
app.set("view engine", "ejs");
//assets
app.use(express.static("assets"));
// use cookies
app.use(cookieParser());
// users Routers

app.use(users_router);

// run server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server run on PORT ${PORT}`);
});
