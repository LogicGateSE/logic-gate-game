import LogicGateComponent from "./logicgate_component";
import React from "react";
import App from "./intro";

export default function LogicGateLevel(props) {
  let myRef = React.createRef();

  const handleBack = () => {
    props.root.render(<App tab="home" root={props.root} />);
  };

  const handleAddGate = (type) => {
    console.log("Adding gate: " + type);
    let logicCanvas = myRef.current.logicCanvas;
    logicCanvas.createGate(type);
    logicCanvas.showWireFrame();
  };

  return (
    <div>
      <h1>Logic Gate Level</h1>
      <button onClick={handleBack}>Back</button>
      <LogicGateComponent
        ref={myRef}
        inputCount={props.challenge.inputCount}
        outputCount={props.challenge.outputCount}
      ></LogicGateComponent>
      <button onClick={() => handleAddGate("OR")}>OR</button>
      <button onClick={() => handleAddGate("AND")}>AND</button>
      <button onClick={() => handleAddGate("NOT")}>NOT</button>
      <button onClick={() => handleAddGate("XOR")}>XOR</button>
      <p>{props.challenge.text}</p>
    </div>
  );
}
