const express = require("express");
const router = express.Router();
const path = require("path");

// For our home screen we add a route to the empty directory
// the route simply serves the static html file in the home folder.
router.get("/", (req, res) => {
  res.sendFile(path.resolve("./home/index.html"));
});

router.get("/instructions", (req, res) => {
  res.sendFile(path.resolve("./instructions/index.html"));
});

router.get("/game", (req, res) => {
  res.sendFile(path.resolve("./game/index.html"));
});

router.get("/game", (req, res) => {
  res.sendFile(path.resolve("./game/index.html"));
});

router.get("/controller", (req, res) => {
  res.sendFile(path.resolve("./controller/controller.html"));
});

module.exports = router;
