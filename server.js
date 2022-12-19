const express = require("express");
const cors = require("cors");

const app = express(); //initialize the app

app.get("/hello", (req, res) => {
  res.send("hello thereee");
});

app.listen(1337, () => {
  console.log("Server started on port 1337");
});
