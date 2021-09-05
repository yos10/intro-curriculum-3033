'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefectureDataMap = {}; // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  // 1行目っぽかったらスキップ
  if (prefecture == '都道府県名') {
    return;
  }
  // 都道府県のオブジェクトが用意されてなかったら空のオブジェクトを用意
  if (prefectureDataMap[prefecture] === undefined) {
    prefectureDataMap[prefecture] = {};
  }
  prefectureDataMap[prefecture][year] = popu;
});
rl.on('close', () => {
  for (const prefecture in prefectureDataMap) {
    prefectureDataMap[prefecture].change =
      prefectureDataMap[prefecture]['2015'] /
      prefectureDataMap[prefecture]['2010'];
  }
  const rankingArray = Object.entries(prefectureDataMap).sort(
    (pair1, pair2) => {
      return pair2[1].change - pair1[1].change;
    }
  );
  const rankingStrings = rankingArray.map(([key, value]) => {
    return (
      key +
      ': ' +
      value['2010'] +
      '=>' +
      value['2015'] +
      ' 変化率:' +
      value.change
    );
  });
  console.log(rankingStrings);
});
