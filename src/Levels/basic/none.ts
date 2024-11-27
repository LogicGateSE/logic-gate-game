let level = {
  inputs: [
    "IN"
  ],
  outputs: [
    "OUT"
  ],
  text: "Connect the input to the output",
  testCasesGen: ()=>{
    return [
      {inputs: [0], outputs: [0]},
      {inputs: [1], outputs: [1]}
    ];
  }
};

export default level;