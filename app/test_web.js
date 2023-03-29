const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/send', (req, res) => {
  const text = req.body.text;
  console.log(text);
  fs.appendFile('log.txt', text + '\n', (err) => {
    if (err) throw err;
  });
  res.send('Received text: ' + text);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});