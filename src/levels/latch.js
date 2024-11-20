let levelLatch = {
  inputs: [
    "S",
    "R"
  ],
  outputs: [
    "Q",
    "Q'"
  ],
  text: "Make a latch",
  testCasesGen: ()=>{
    return [
      {inputs: [0, 1], outputs: [1, 0]},
      {inputs: [0, 0], outputs: [1, 0]},
      {inputs: [1, 0], outputs: [0, 1]},
      {inputs: [0, 0], outputs: [0, 1]},
      {inputs: [1, 1], outputs: [0, 0]},
      ];
  }
};

export default levelLatch;