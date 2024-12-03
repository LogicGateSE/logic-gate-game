import Solution from '../logicgate_back.js';
import LogicCanvas from '../logicgate_front.js';
import '../logicgate.css'
import React from 'react';

class LogicGateComponent extends React.Component<{inputCount?: number, outputCount?: number, ref?: React.RefObject<any>}> {
  logicCanvas: LogicCanvas;

  componentDidMount() {
    let logicDiv = document.getElementById("logic-canvas-here");
    logicDiv.id = "logic-canvas-here";
    logicDiv.style.width = "700px"
    logicDiv.style.height = "400px"
    logicDiv.style.marginLeft = "auto";
    logicDiv.style.marginRight = "auto";

    // Create the logic canvas
    let mainWorld = new Solution();
    let logicCanvas = new LogicCanvas(mainWorld, logicDiv);
    
    // Start the visual and world ticks
    logicCanvas.startVisualTick();
    logicCanvas.startWorldTick(20);

    if(this.props.inputCount){
      for(let i = 0; i < this.props.inputCount; i++){
        logicCanvas.createInput();
      }
    }

    if(this.props.outputCount){
      for(let i = 0; i < this.props.outputCount; i++){
        logicCanvas.createOutput();
      }
    }

    logicCanvas.showWireFrame();

    this.logicCanvas = logicCanvas;
  }

  componentWillUnmount() {
    console.log("Destroying logic canvas");
    let logicCanvas = this.logicCanvas;
    logicCanvas.stopVisualTick();
    logicCanvas.stopWorldTick();
    logicCanvas.remove();
  }

  render() {
    return (
      <div id="logic-canvas-here"></div>
    );
  }
}

export default LogicGateComponent;