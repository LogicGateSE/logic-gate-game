let level = {
  inputs: [
    "IN 1",
    "IN 2"
  ],
  outputs: [
    "OUT"
  ],
  text: "Use an AND gate to connect the inputs to the output",
  testCasesGen: ()=>{
    return [
      {inputs: [0, 0], outputs: [0]},
      {inputs: [0, 1], outputs: [0]},
      {inputs: [1, 0], outputs: [0]},
      {inputs: [1, 1], outputs: [1]}
    ];
  }
};

export default level;