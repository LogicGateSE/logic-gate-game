let level = {
  inputs: [
    "IN"
  ],
  outputs: [
    "OUT"
  ],
  text: "Use a NOT gate to connect the input to the output",
  testCasesGen: ()=>{
    return [
      {inputs: [0], outputs: [1]},
      {inputs: [1], outputs: [0]}
    ];
  }
};

export default level;