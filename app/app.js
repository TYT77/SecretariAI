const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/upload', (req, res) => {
  
  // クライアントから送信されたデータを扱いやすい形に整える
  const text = req.body.text;

  // chatGPTに問い合わせる
  chatGPTQuery(text)
  .then((result) => {
    // VOICEVOXで音声合成
    synthesis(result)
    .then((filename) => {
      
      // wavファイルを読み込む
      const filePath = path.join(__dirname, 'wav/'+filename);
      const stat = fs.statSync(filePath);

      // ヘッダーを設定して、wavファイルを返す
      res.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Content-Length': stat.size
      });
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
      
    })
    .catch((error) => {
      console.error(error);
    });
  })
  .catch((err) => {
    console.error(err);
  });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

async function chatGPTQuery(msg) {

  // console.log(msg);

  if (msg !== null) {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }],
      });
      return completion.data.choices[0].message.content;
    } catch (error) {
      console.error(error);
      return "エラーが発生しました。もう一度お願いします。";
    }
  }

  return "うまく聞き取れませんでした。もう一度お願いします。";
}

function synthesis(msg) {

  // console.log(msg);

  return new Promise((resolve, reject) => {
    // 文章を音声合成する前処理
    axios
      .post(`http://voicebox:50021/audio_query?speaker=47&text="${msg}"`)
      .then((queryRes) => {
        // 音声合成
        axios
          .post(`http://voicebox:50021/synthesis?speaker=47`, queryRes.data, {
            responseType: "arraybuffer",
          })
          .then((res) => {
            const uuid = uuidv4();
            var filename = uuid + ".wav";

            // 生成した音声データをwav形式で出力
            fs.writeFileSync("./wav/" + filename, res.data);

            resolve(filename); // Promiseの解決にfilenameを設定する
          })
          .catch((error) => {
            reject(error); // Promiseの拒否にerrorを設定する
          });
      })
      .catch((error) => {
        reject(error); // Promiseの拒否にerrorを設定する
      });
  });
}