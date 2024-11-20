import LogicGateComponent from "./logicgate_component";
import React from "react";
import App from "./intro";

export default function LogicGateLevel(props) {
  let logicGateComp = React.createRef();
  let resultMessage = React.createRef();
  let logicCanvas = null;
  let world = null;

  // run after loaded
  React.useEffect(() => {
    logicCanvas = logicGateComp.current.logicCanvas;
    world = logicCanvas.world;
  }, []);

  const handleBack = () => {
    props.root.render(<App tab="home" root={props.root} />);
  };

  const handleAddGate = (type) => {
    console.log("Adding gate: " + type);
    let logicCanvas = logicGateComp.current.logicCanvas;
    logicCanvas.createGate(type);
    logicCanvas.showWireFrame();
  };

  const handleSubmit = async () => {
    let testCases = props.challenge.testCasesGen();
    let result = {
      correct: true,
      message: "Not yet implemented",
    }

    for(let i=0; i<testCases.length; i++) {
      let inputs = testCases[i].inputs;
      let outputs = testCases[i].outputs;
      let actualOutputs = await world.evaluate(inputs, true)

      outputs = outputs.map((x) => x ? 1 : 0);
      actualOutputs = actualOutputs.map((x) => x ? 1 : 0);

      if(outputs.length !== actualOutputs.length) {
        result.correct = false;
        result.message = "Output length mismatch";
        break;
      }

      for(let j=0; j<outputs.length; j++) {
        if(outputs[j] !== actualOutputs[j]) {
          result.correct = false;
          result.message = `Output mismatch at test case, inputs: ${inputs}, got: ${actualOutputs}, expected: ${outputs}`;
          break;
        }
      }
      if(!result.correct) {
        break;
      }else{
        result.message = "All test cases passed";
      }
    }
    resultMessage.current.innerText = result.message;
  }



  return (
    <div>
      <h1>Logic Gate Level</h1>
      <button onClick={handleBack}>Back</button>
      <LogicGateComponent
        ref={logicGateComp}
        inputCount={props.challenge.inputCount}
        outputCount={props.challenge.outputCount}
      ></LogicGateComponent>
      <button onClick={() => handleAddGate("OR")}>OR</button>
      <button onClick={() => handleAddGate("AND")}>AND</button>
      <button onClick={() => handleAddGate("NOT")}>NOT</button>
      <button onClick={() => handleAddGate("XOR")}>XOR</button>
      <p>{props.challenge.text}</p>
      <button onClick={handleSubmit}>Submit</button>
      <p ref={resultMessage}></p>
    </div>
  );
}
