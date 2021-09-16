const fs = require("fs");
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
  var ip = req.headers["x_forwarded_for"] || req.socket.remoteAddress;
  res.render("index", {
    user: ip,
  });
});
app.get('/image/user/uploaded/:img', (req,res) => {
  fs.readFile(`./public/images/user/uploaded/${req.params.img}`, function(err, data) {
    if (err) throw err // Fail if the file can't be read.
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data);
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");
  let raw = fs.readFileSync("./storage/msg.json");
  let data = JSON.parse(raw);
  
  let user_count = io.engine.clientsCount
  io.sockets.emit("jumlah user update", user_count)
  socket.on("disconnect", user_count);

  socket.emit("load message", data);

  socket.on("message sent", (mesData) => {
    var filenames = [];
    if(mesData.file) {
      let img = mesData.file;
      for (let i in img)
      {
        let fname = makeid(50);
        fs.writeFileSync(`./public/images/user/uploaded/${fname}`, img[i]);
        filenames.push(fname);
      }
    }
    let newMsg = {
      name: mesData.name,
      msg: mesData.message,
      files: filenames
    };
    let raw = fs.readFileSync("./storage/msg.json");
    let data = JSON.parse(raw);
    data.push(newMsg);
    fs.writeFileSync("./storage/msg.json", JSON.stringify(data));

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

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) 
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      const date = new Date();
      const filename = `${result}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.png`;
    return filename;
  }
  socket.on("tes img", (img) => {
    // console.log(img);
    fs.writeFileSync(`./public/images/user/tes.png`, img['0']);
  })
});

server.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});
