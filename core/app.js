const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const CONSTANT = require("./CONSTANT.json");
const app = express();
const path = require("path");
const postRoutes = require("./routes/postdRoutes");
const userRoutes = require("./routes/userRoutes");
require('dotenv').config(); 

mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000
  })
  .then(() => {
    console.log("Connected to Mongodb successfully. ");
  })
  .catch((err) => {
    console.log("Mongodb Connection failed");
  });

 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// posts routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
