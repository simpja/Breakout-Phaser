const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 3000;

// The homepage
app.use("/home/", express.static(__dirname + "/home/"));
// Serve the game at localhost:3000/game/ using express static files.
app.use("/game/", express.static(__dirname + "/game/"));
// The instructions page
app.use("/instructions/", express.static(__dirname + "/instructions/"));

// Serve the controllers at localhost:[port]/controllerTop/ and localhost:[port]/controllerBottom/ using static files. Spesifying the html-file since it is not called index.html.
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

  socket.on("set-position-bottom", (event) => {
    io.emit("set-position-bottom", event);
    // console.log("url" + socket.handshake.url);
  });

  socket.on("set-position-top", (event) => {
    io.emit("set-position-top", event);
    // console.log("hei controller 2");
  });
});

http.listen(port, function() {
  console.log(`listening on: ${port}`);
});
