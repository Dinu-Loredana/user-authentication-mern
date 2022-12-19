const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");
const app = express(); //initialize the app
// cors & json are used by app as middleware
app.use(cors());
app.use(express.json());

// connect with mongodb (will be created authomatically a db named user-authentication-mern )
mongoose.connect("mongodb://localhost:27017/user-authentication-mern", () => {
  console.log("DB connected successfully");
});

// register endpoint
app.post("/api/register", async (req, res) => {
  // create the user and save it to the db
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "Duplicate email" });
  }
});

//login endpoint
app.post("/api/login", async (req, res) => {
  // find the user with the email and passw from the request, otherwise returns null
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  //console.log("user login endpoint", user); // returns the entire object that matches these credentials
  if (user) {
    // create the token - pass data that want to be saved into browser and a secret key that checks whether the credentials has changed or not
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});
// app.get("/hello", (req, res) => {
//   res.send("hello thereee");
// });

app.listen(1333, () => {
  console.log("Server started on port 1333");
});
