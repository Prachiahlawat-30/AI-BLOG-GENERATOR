const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("TEST SERVER WORKING");
});

app.listen(5000, () => {
  console.log("Test server running on port 5000");
});