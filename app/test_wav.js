const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json()); // JSONのPOSTデータを受け取るためのミドルウェア

app.post('/upload', (req, res) => {
  
  const text = req.body.text;
  console.log(text);

  // wavファイルを読み込む
  const filePath = path.join(__dirname, 'wav/sample.wav');
  const stat = fs.statSync(filePath);
  
  // ヘッダーを設定して、wavファイルを返す
  res.writeHead(200, {
    'Content-Type': 'audio/wav',
    'Content-Length': stat.size
  });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});