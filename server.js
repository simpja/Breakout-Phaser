const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.port || 3000;
const path = require("path");
const router = express.Router();
// const routes = require("./routes/index");

// For our home screen we add a route to the empty directory
// the route simply serves the static html file in the home folder.
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/home/index.html"));
});
/*
...And in order for this static HTML-file to reach its CSS- and js files (static assets), 
we need to serve the home folder directory as static assets using app.use('path')
However, this approach puts all assets in the same root folder
Better then to add a virtual server path like this: app.use('virtual server path', 'local asset path');
In that way, we can categorize all our assets in folders
*/
app.use("/home", express.static(__dirname + "/home/"));

// Following the same approach as our home screen, we can serve our routes and their static assets the same way
router.get("/instructions", (req, res) => {
  res.sendFile(path.join(__dirname + "/instructions/index.html"));
});
app.use("/instructions", express.static(__dirname + "/instructions/"));
app.use("/assets", express.static(__dirname + "/assets/"));

router.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname + "/game/index.html"));
});
app.use("/game", express.static(__dirname + "/game/"));

router.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname + "/game/index.html"));
});
app.use("/game", express.static(__dirname + "/game/"));

router.get("/controller", (req, res) => {
  res.sendFile(path.join(__dirname + "/controller/controller.html"));
});
// Serve the controllers at localhost:[port]/controller/ and localhost:[port]/controllerBottom/ using static files. Spesifying the html-file since it is not called index.html.
app.use("/controller/", express.static(__dirname + "/controller/"));

/* app.get("/controllerBottom/*", function(req, res) {
  res.sendFile(__dirname + "/controller/" + "controllerBottom.html");
});
app.get("/controller/*", function(req, res) {
  res.sendFile(__dirname + "/controller/" + "controller.html");
}); */

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

app.use("/", router);

http.listen(port, "0.0.0.0", function() {
  console.log(`listening on: ${port}`);
});
