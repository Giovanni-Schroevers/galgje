const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: 'http://localhost:3000',
  }
});

let serverWord = "";
let guesses = 10;
let guessedLetters = [];

io.on('connection', (socket) => {
  console.log("A user has connected")
  io.emit('setWord', serverWord);
  io.emit('setGuesses', guesses);
  io.emit('setGuesedLetters', guessedLetters);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('setWord', (word) => {
    serverWord = word;
    io.emit('setWord', word);
  });

  socket.on('correctGuess', (letter) => {
    guessedLetters.push(letter);
    io.emit('setGuesedLetters', guessedLetters);
  });

  socket.on('incorrectGuess', (letter) => {
    guessedLetters.push(letter);
    guesses = guesses-1;
    io.emit('setGuesses', guesses);
    io.emit('setGuesedLetters', guessedLetters);
  });
})

server.listen(8000, () => {
  console.log('listening on *:8000');
});
