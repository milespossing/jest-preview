const express = require('express');
const cors = require('cors');
const glob = require('glob');
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

app.listen(PORT, () => {
  console.log('server listening on port', PORT);
});