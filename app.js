'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

// データを組み替えるためのMapデータ
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

// ファイルを行単位で処理する
rl.on('line', (lineString) => {

  // 列別のデータに分割
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);  // 年
  const prefecture = columns[1];  // 都道府県
  const popu = parseInt(columns[3]);  // 人口

  // 2010年または2015年のデータのみ処理する
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    
    // 1週目でデータがないときは value を初期化する
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }

    // 年度別のデータをセット
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }

    // 都道府県をキーにしてデータを登録
    prefectureDataMap.set(prefecture, value);
  }
});

// ファイルの読み込み終了時に処理したいコードを書く
rl.on('close', () => {

  // 変化率を計算
  for (const [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }

  // ランキング化したデータを作成
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    // 並び替えのルールを書く
    return pair1[1].change - pair2[1].change;
  });

  // データを表示用に整形する
  const rankingStrings = rankingArray.map(([key, value], i) => {
    // 1行ずつどのように整形するかのルールを書く
    return `${i + 1}位 ${key}: ${value.popu10} => ${value.popu15} 変化率: ${value.change}`;
  });
  console.log(
    '2010 年から 2015 年にかけて 15〜19 歳の人が減った割合の都道府県ランキング'
  );
  console.log(rankingStrings);
});
