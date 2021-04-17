const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: 'http://localhost:3000',
  }
});

let serverWord = "";

io.on('connection', (socket) => {
  console.log("A user has connected")
  if (serverWord) {
    io.emit('setWord', serverWord);
  }
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('setWord', (word) => {
    serverWord = word;
    io.emit('setWord', word);
  });
})

server.listen(8000, () => {
  console.log('listening on *:8000');
});
