const fs = require('fs');
const path = require('path');
var express = require('express');
var app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/jquery/jquery.js', function(req, res) {
    res.sendfile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
  io.on('connection', (socket) => {
    console.log('a user connected');
    let raw = fs.readFileSync('msg.json');
    let data = JSON.parse(raw);
    socket.emit('load message', data)

    socket.on('message sent', (msg) => {
        console.log(msg);
        let newMsg = {
            name: "Anon",
            msg: msg
        }
        let raw = fs.readFileSync('msg.json');
        let data = JSON.parse(raw);
        data.push(newMsg);
        fs.writeFileSync('msg.json',JSON.stringify(data));

        io.sockets.emit('new message',data);
      });
  });
  
  server.listen(3000, () => {
    console.log('listening on http://localhost:3000');
  });

