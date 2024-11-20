let levelTwoOr = {
  inputs: [
    "M1",
    "M2",
    "M3"
  ],
  outputs: [
    "Light"
  ],
  text: "Add an OR gate",
  testCasesGen: ()=>{
    return [
      {inputs: [0, 0, 0], outputs: [0]},
      {inputs: [0, 0, 1], outputs: [1]},
      {inputs: [0, 1, 0], outputs: [1]},
      {inputs: [0, 1, 1], outputs: [1]},
      {inputs: [1, 0, 0], outputs: [1]},
      {inputs: [1, 0, 1], outputs: [1]},
      {inputs: [1, 1, 0], outputs: [1]},
      {inputs: [1, 1, 1], outputs: [1]}
      ];
  }
};

export default levelTwoOr;