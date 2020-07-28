const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const routes = require("./routes/index");
const errorHandlers = require("./handlers/errorHandlers");

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
    // console.log("url" + socket.handshake.url);
  });

  socket.on("set-position-top", (event) => {
    io.emit("set-position-top", event);
    // console.log("hei controller 2");
  });
});

app.use("/", routes);

app.use(errorHandlers.notFound);

http.listen(port, "0.0.0.0", function() {
  console.log(`listening on: ${port}`);
});
