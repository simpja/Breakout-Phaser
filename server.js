const express = require("express");
const app = express();
const http = require("http").createServer(app);
// const io = require("socket.io")(http);
const port = 3000;

app.use(express.static(__dirname + "/")); //serving static files

/*
app.get("/", function(req, res) {
  res.status(404).send("Sorry can't find that :/");
  res.sendFile(`${__dirname}/index.html`);
});
*/

http.listen(port, function() {
  console.log(`listening on: ${port}`);
});
