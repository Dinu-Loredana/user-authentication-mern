const express = require("express");
const cors = require("cors");
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
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (user) {
    return res.json({ status: "ok", user: true });
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
