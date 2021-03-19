const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

//importuje routes
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

mongoose.connect("mongodb://localhost/kc", { useNewUrlParser: true });

const app = express();

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("yay");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//static midleware any requisest targeimages will llowed to contitnue
// path.join u  sustuini dovodi do toga da svi zahtevi koji sardrze inames se redirektuju unavedeni fodler
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type,  Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//making express avare of it//forwarduje sve sa ove adrese na ono iza zareza
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
//then je callbackk
