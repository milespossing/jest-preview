const express = require('express');
const cors = require('cors');
const glob = require('glob');
const socket = require('socket.io');
const path = require('path');

const app = express();
const PORT = 9000;
// const pathToTestOutput = path.join(__dirname, './public/testFiles')
// const dist = path.join(__dirname, './build')

app.use(cors());


// app.use(express.static(pathToTestOutput))
// app.use(express.static(dist))

// app.get('/master.json', (req, res, next) => {
//   const files = glob.sync(path.join(pathToTestOutput, '*.json')).map(filename => require(filename));

//   res.json(files)
//   return next();
// });

const server = app.listen(PORT, () => {
  console.log('server listening on port', PORT);
});

// Socket setup & pass server
const io = socket(server, {
  cors: {
    origin:'*'
  }
});

io.on('connection', socket => {
  // console.log('socket connected', socket.id);

  socket.on('domChanged', (data) => {
    console.log(data.testName);
    io.emit('domChanged', data);
  })

  socket.on('testSetup', (data) => {
    io.emit('testSetup', data);
  })

  socket.on('disconnect', () => {
    // console.log('socket disconnected', socket.id)
  });
});