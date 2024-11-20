import { default as levelNone } from './basic/none.js';
import { default as levelNot } from './basic/not.js';
import { default as levelAnd } from './basic/and.js';
import { default as levelOr } from './basic/or.js';

import { default as levelLatch } from './others/latch.js';
import { default as levelTwoOr } from './others/twoOr.js';

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