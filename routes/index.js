const express = require("express");
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const { db } = require("../models/Game");
const { doesNotMatch } = require("assert");

// Import environmental variables from our variables.env file
require("dotenv").config({ path: "variables.env" });

// Connect to our Database and handle bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell mongoose to use ES6 promises
mongoose.connection.on("error", (err) => {
  console.error(`Mongoose failed with: ${err.message}`);
});
// import DB models here:
require("../models/Game");
const Game = mongoose.model("Game"); // Get our Game Schema

router.post("/addGame", async (req, res) => {
  let gameExists = false;
  try {
    const game = new Game(req.body);
    // If the game name already exists, we do not want to create a new one
    await Game.findOne({ name: game.name }, (err, document) => {
      if (err) {
        console.log(
          `Something failed while fetching documents: ${err.message}`
        );
      } else if (document) {
        console.log("Game with game name already exists!");
        gameExists = true;
      } else {
        // Document doesn't exist, creating new
        console.log("Creating new game");
        gameExists = false;
      }
    });

    if (!gameExists) {
      console.log(`New game created: ${game.name}`);
      await game.save();
    }
    res.redirect(`/game?gameName=${req.body.name}`);
  } catch (err) {
    console.log(`Something failed while adding game: ${err.message}`);
  }
});

router.put("/updateGame", async (req, res) => {
  try {
    if (
      req.body.gameName == null &&
      req.body.scoreTopIncrement == null &&
      req.body.scoreBottomIncrement == null
    ) {
      throw {
        name: "ReferenceError",
        message: "Unexpected parameters",
      };
    }
    var query = { name: `${req.body.gameName}` };
    var increment = {
      scoreTop: req.body.scoreTopIncrement,
      scoreBottom: req.body.scoreBottomIncrement,
    };
    const updateResult = await Game.update(query, {
      $inc: increment,
    });
    res.status(201).json(updateResult);
  } catch (err) {
    console.log(
      `Something failed while updating game. Error name: ${err.name} and error message: ${err.message}`
    );
    res.status(400).json(err.message);
  }
});

router.get("/getGame", async (req, res) => {
  try {
    var query = { name: `${req.query.gameName}` };
    const returnGame = await Game.findOne(query);
    res.json(returnGame);
  } catch (err) {
    console.log(`Something failed while getting game: ${err.message}`);
  }
});

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

router.get("/addGame", (req, res) => {
  res.sendFile(path.resolve("./addGame/index.html"));
});

router.get("/controller", (req, res) => {
  res.sendFile(path.resolve("./controller/controller.html"));
});

module.exports = router;
