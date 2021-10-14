const express = require('express');
const cors = require('cors');
const glob = require('glob');
const socket = require('socket.io');
const path = require('path');

const app = express();
const PORT = 9000;
const pathToTestOutput = path.join(__dirname, './test_json/')

app.use(cors());


app.use(express.static(pathToTestOutput))

app.get('/master.json', (req, res, next) => {
  const files = glob.sync(path.join(pathToTestOutput, '*.json')).map(filename => require(filename));

  res.json(files)
  return next();
});

const server = app.listen(PORT, () => {
  console.log('server listening on port', PORT);
});

// Socket setup & pass server
const io = socket(server);

io.on('connection', socket => {
  console.log('made socket connection');

   // Handle jest call event
  socket.on('jestCall', data => {
    io.emit('jestCall', data);
  });
});