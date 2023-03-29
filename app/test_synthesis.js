const axios = require('axios');
const fs = require('fs');

var question = "こんにちは。現在時刻は何時ですか？";
var isplay = false;

if(!isplay && question !== null) {
    isplay = true;
    
    // msg = response.data.choices[0].message.content
    var msg = question;

    // VOICEVOXで音声合成
    // 文章を音声合成する前処理
    axios.post(`http://voicebox:50021/audio_query?speaker=47&text="${msg}"`)
    .then((queryRes) => {
        
        // 音声合成
        axios.post(`http://voicebox:50021/synthesis?speaker=47`, queryRes.data, {responseType: "arraybuffer",})
        .then((res) => {
            
            // 生成した音声データをwav形式で出力
            fs.writeFileSync("tmp_voice.wav", res.data);

            isplay = false;

        });
    });      

}else{
    console.log("processing...");
}


