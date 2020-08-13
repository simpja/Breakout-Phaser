const express = require("express");
const bodyParser = require("body-parser"); // In order for Express to handle json in body
const port = process.env.PORT || 3000;
const routes = require("./routes/index");
// const errorHandlers = require("./handlers/errorHandlers");
const path = require("path"); // Only for test
// Create the Express app
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
/*
...In order for the static HTML-files in our routes to reach its CSS- and js files (static assets), 
we need to serve the home folder directory as static assets using app.use('path')
However, this approach puts all assets in the same root folder
Better then to add a virtual server path like this: app.use('virtual server path', 'local asset path');
In that way, we can categorize all our assets in folders
*/
app.use("/home", express.static(__dirname + "/home/"));
app.use("/instructions", express.static(__dirname + "/instructions/"));
app.use("/assets", express.static(__dirname + "/assets/"));
app.use("/game", express.static(__dirname + "/game/"));
app.use("/controller/", express.static(__dirname + "/controller/"));

// Handle socket stuff!
io.on("connection", function(socket) {
  console.log("someone connected!");
  socket.on("set-position-bottom", (event) => {
    io.emit("set-position-bottom", event);
  });
  socket.on("set-position-top", (event) => {
    io.emit("set-position-top", event);
  });
});

// Takes the raw requests and turns them into usable properties on req.body
// Use this to POST a game upon submit
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes are handled in a separate file
app.use("/", routes);

//app.use(errorHandlers.notFound);

http.listen(port, "0.0.0.0", function() {
  console.log(`listening on: ${port}`);
});
