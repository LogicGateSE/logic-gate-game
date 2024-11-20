import { default as levelNone } from './levels/basic/none.js';
import { default as levelNot } from './levels/basic/not.js';
import { default as levelAnd } from './levels/basic/and.js';
import { default as levelOr } from './levels/basic/or.js';

import { default as levelLatch } from './levels/latch.js';
import { default as levelTwoOr } from './levels/twoOr.js';

// let levels = {
//   "basic": {
//     "none": levelNone,
//     "and": levelAnd,
//     "or": levelOr,
//     "not": levelNot,
//   },
//   "others":{
//     "latch": levelLatch,
//     "twoOr": levelTwoOr,
//   }
// }

let levels = [
  {
    name: "basic", levels: [
      { name: "none", level: levelNone },
      { name: "and", level: levelAnd },
      { name: "or", level: levelOr },
      { name: "not", level: levelNot }
    ]
  },
  {
    name: "others", levels: [
      { name: "latch", level: levelLatch },
      { name: "twoOr", level: levelTwoOr }
    ]
  }
]


// root/level/basic/and

export default levels;