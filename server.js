const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// const io = require("socket.io")(http);
const port = 3000;

//Serve the game at localhost:3000/game/ using express static files.
app.use("/game/", express.static(__dirname + "/game/")); //serving static files for game

//Serve the controllers on localhost:3000/controller/ using static files. but spesicy the html since it is not calles index.html...
app.use("/controller/", express.static(__dirname + "/controller/"));
app.get("/controllerBottom/*", function(req, res) {
  res.sendFile(__dirname + "/controller/" + "controllerBottom.html");
});
app.get("/controllerTop/*", function(req, res) {
  res.sendFile(__dirname + "/controller/" + "controllerTop.html");
});

// Handle socket stuff!
io.on("connection", function(socket) {
  console.log("someone connected!");

  socket.on("control", event => {
    console.log("skjer dette noen gang??");
    io.emit("gameControl", event);
  });

  socket.on("set-position-bottom", event => {
    io.emit("set-position-bottom", event);
    //console.log("url" + socket.handshake.url);
  });
  socket.on("set-position-top", event => {
    io.emit("set-position-top", event);
    //console.log("hei controller 2");
  });
});
/*
app.get("/controller", function(req, res) {
  res.status(404).send("Sorry can't find that :/");
  res.sendFile(__dirname + "controller.html");
});
*/

http.listen(port, function() {
  console.log(`listening on: ${port}`);
});
