const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");
const { response } = require("express");
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

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, //store encrypted passw into db
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
    //password: req.body.password,
  });

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  //console.log("user login endpoint", user); // returns the entire object that matches these credentials
  if (!user) {
    return { status: "error", error: "invalid login" };
  }
  if (isPasswordValid) {
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

// quote endpoint
app.get("/api/quote", async (req, res) => {
  // get token from the req header
  const token = req.headers["x-access-token"];
  console.log("token from header", token);
  try {
    // check the token with the secret key/ perform the authentication
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("-----decoded", decoded);

    const email = decoded.email;
    // get the user based on the email from the token
    const user = await User.findOne({ email: email });
    console.log("user", user); // returns the entire object
    return res.json({ status: "ok", quotes: user.quotes });
  } catch (error) {
    res.json({ status: "error", error: "invalid token get /api/quote" });
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const quotes = decoded.quotes;
    await User.updateOne(
      { email: email },
      { $push: { quotes: req.body.quote } }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "invalid token post /api/quote" });
  }
});
// app.get("/hello", (req, res) => {
//   res.send("hello thereee");
// });

app.listen(1333, () => {
  console.log("Server started on port 1333");
});
