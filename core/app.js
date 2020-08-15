const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://rohitw:hqYN8Mhi7rTALUoQ@cluster0.b1zqa.mongodb.net/angular-mean-course?retryWrites=true&w=majority";
const app = express();
const postRoutes = require("./routes/postdRoutes");

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Mongodb successfully. ");
  })
  .catch(() => {
    console.log("Mongodb Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);

module.exports = app;
