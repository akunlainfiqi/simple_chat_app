const fs = require("fs");
const path = require("path");
var express = require("express");
var app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 3000;

app.use(express.static("public"));

app.get("/jquery/jquery.js", function (req, res) {
  res.sendFile(__dirname + "/node_modules/jquery/dist/jquery.min.js");
});
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  // res.sendFile(__dirname + '/views/index.html');
  var ip = req.headers["x_forwarded_for"] || req.socket.remoteAddress;
  res.render("index", {
    user: ip,
  });
});
var usersTyping = [];
var uTypingIndex = {};
io.on("connection", (socket) => {
  console.log("a user connected");
  let raw = fs.readFileSync("msg.json");
  let data = JSON.parse(raw);
  socket.emit("load message", data);

  socket.on("message sent", (mesData) => {
    console.log(mesData);
    let newMsg = {
      name: mesData.name,
      msg: mesData.message,
    };
    let raw = fs.readFileSync("msg.json");
    let data = JSON.parse(raw);
    data.push(newMsg);
    fs.writeFileSync("msg.json", JSON.stringify(data));

    io.sockets.emit("new message", data);
  });

  socket.on("is typing", (user) => {
    let name = user.name.replace(/ /g, "-");
    io.sockets.emit("is typing", name);
  });
  socket.on("done typing", (user) => {
    let name = user.name.replace(/ /g, "-");
    io.sockets.emit("done typing", name);
  });
});

server.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});
