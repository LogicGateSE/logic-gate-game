import {
  LevelData,
  StarRequirement,
  stringTaskWrapper,
  TruthTableRow,
  truthTableWrapper,
  TSSolution,
} from "../LevelInterfaces";
import React, { PropsWithChildren } from "react";
import CSS from 'csstype';

export default class LevelLatch implements LevelData {
  readonly inputs: Array<string> = ["S", "R"];
  readonly outputs: Array<string> = ["Q", "Q'"];

  private starOne(_: TSSolution): boolean {
    return true;
  }

  private starTwo(world: TSSolution): boolean {
    return world.numGate === 4;
  }

  private starThree(_: TSSolution, timeElapsed: number): boolean {
    return timeElapsed < 180;
  }

  readonly levelID: string = "SRL";
  readonly levelName: string = "SR Latch";

  readonly myStyle: CSS.Properties = {
    width: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
  };

  readonly levelTask: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div>
      <p>
        <b>What is an SR Latch?</b> - An SR (Set-Reset) Latch is a basic 
        sequential circuit used to store a single bit of information. Unlike 
        combinational circuits, it has memory, meaning its output depends not 
        only on the current inputs but also on its previous state.
        <br /><br />
        <b>Inputs:</b><br />
        <b>S (Set):</b> Sets the output to 1.<br />
        <b>R (Reset):</b> Resets the output to 0.<br />
        <br />
        <b>Outputs:</b><br />
        <b>Q:</b> Current state.<br />
        <b>Q':</b> Complement of Q.<br />
        <br />
        <img
          src={"https://sub.allaboutcircuits.com/images/04173.png"}
          style={this.myStyle}
        ></img>
        <br />
        <b>Why is it important?</b> - SR Latches are fundamental building blocks 
        for flip-flops and memory elements in digital systems. They provide a 
        way to maintain a stable output state based on input and past conditions.
        <br /><br />
        <a
          href="https://en.wikipedia.org/wiki/Flip-flop_(electronics)#SR_NOR_latch"
          style={{ textAlign: "right", display: "inline-block", width: "100%" }}
        >
          Read More
        </a>
      </p>
    </div>
  );

  readonly starRequirements: Array<StarRequirement>;

  constructor() {
    this.starRequirements = [
      { f: this.starOne, description: "Correct Solution" },
      { f: this.starTwo, description: "Uses Four Gates" },
      { f: this.starThree, description: "< 3 minutes" },
    ];
  }

  readonly truthTable: (() => Array<TruthTableRow>) | Array<TruthTableRow> =
    () => {
      return [
        { inputs: [false, true], outputs: [true, false] },
        { inputs: [false, false], outputs: [true, false] },
        { inputs: [true, false], outputs: [false, true] },
        { inputs: [false, false], outputs: [false, true] },
        { inputs: [true, true], outputs: [false, false] }, // Invalid state.
      ];
    };

  public levelComplete(world: TSSolution) {
    let workingTable: () => Array<TruthTableRow> = this.TruthTable;

    for (let row of workingTable()) {
      if (!world.evaluateSync(row.inputs, true)) {
        return false;
      }
    }

    return true;
  }

  get LevelTask(): React.FC<PropsWithChildren> {
    return stringTaskWrapper(this.levelTask);
  }

  get TruthTable(): () => Array<TruthTableRow> {
    return truthTableWrapper(this.truthTable);
  }

  readonly oracles = [
    { 
      message: "Oh no! We do not have a NOR gate. Maybe you can connect a NOT gate after an OR gate?",
      canvas: {"gates":[{"type":"IN","x":"0px","y":"108.333px","id":0,"state":[false],"isWorldInput":true,"isWorldOutput":false},{"type":"IN","x":"0px","y":"241.667px","id":1,"state":[false],"isWorldInput":true,"isWorldOutput":false},{"type":"OUT","x":"","y":"108.333px","id":2,"state":[false],"isWorldInput":false,"isWorldOutput":true},{"type":"OUT","x":"","y":"241.667px","id":3,"state":[false],"isWorldInput":false,"isWorldOutput":true},{"type":"OR","x":"260px","y":"109px","id":4,"state":[false,false,false],"isWorldInput":false,"isWorldOutput":false},{"type":"NOT","x":"340px","y":"109px","id":5,"state":[false,true],"isWorldInput":false,"isWorldOutput":false}],"wires":[{"t1":{"gateID":4,"terminalID":2},"t2":{"gateID":5,"terminalID":0},"state":false}],"canvasSize":{"width":700,"height":400}},
    },
    {
      message: "We need two NOR gates to implement the SR latch. Try making the second NOR gate.",
      canvas: {"gates":[{"type":"IN","x":"0px","y":"108.333px","id":0,"state":[false],"isWorldInput":true,"isWorldOutput":false},{"type":"IN","x":"0px","y":"241.667px","id":1,"state":[false],"isWorldInput":true,"isWorldOutput":false},{"type":"OUT","x":"","y":"108.333px","id":2,"state":[false],"isWorldInput":false,"isWorldOutput":true},{"type":"OUT","x":"","y":"241.667px","id":3,"state":[false],"isWorldInput":false,"isWorldOutput":true},{"type":"OR","x":"272px","y":"128px","id":4,"state":[false,false,false],"isWorldInput":false,"isWorldOutput":false},{"type":"NOT","x":"362px","y":"127px","id":5,"state":[false,true],"isWorldInput":false,"isWorldOutput":false},{"type":"OR","x":"274px","y":"245px","id":6,"state":[false,false,false],"isWorldInput":false,"isWorldOutput":false},{"type":"NOT","x":"364px","y":"246px","id":7,"state":[false,true],"isWorldInput":false,"isWorldOutput":false}],"wires":[{"t1":{"gateID":4,"terminalID":2},"t2":{"gateID":5,"terminalID":0},"state":false},{"t1":{"gateID":6,"terminalID":2},"t2":{"gateID":7,"terminalID":0},"state":false}],"canvasSize":{"width":700,"height":400}}
    },
    {
      message: "Almost there! All we need to do now is wiring up the NOR gates correctly. Take a look at the diagram and try to replicate it.",
      canvas: {"gates":[{"type":"IN","x":"0px","y":"108.333px","id":0,"state":[false],"isWorldInput":true,"isWorldOutput":false},{"type":"IN","x":"0px","y":"241.667px","id":1,"state":[false],"isWorldInput":true,"isWorldOutput":false},{"type":"OUT","x":"","y":"108.333px","id":2,"state":[false],"isWorldInput":false,"isWorldOutput":true},{"type":"OUT","x":"","y":"241.667px","id":3,"state":[true],"isWorldInput":false,"isWorldOutput":true},{"type":"OR","x":"272px","y":"128px","id":4,"state":[false,true,true],"isWorldInput":false,"isWorldOutput":false},{"type":"NOT","x":"362px","y":"127px","id":5,"state":[true,false],"isWorldInput":false,"isWorldOutput":false},{"type":"OR","x":"274px","y":"245px","id":6,"state":[false,false,false],"isWorldInput":false,"isWorldOutput":false},{"type":"NOT","x":"363px","y":"245px","id":7,"state":[false,true],"isWorldInput":false,"isWorldOutput":false}],"wires":[{"t1":{"gateID":4,"terminalID":2},"t2":{"gateID":5,"terminalID":0},"state":true},{"t1":{"gateID":6,"terminalID":2},"t2":{"gateID":7,"terminalID":0},"state":false},{"t1":{"gateID":7,"terminalID":1},"t2":{"gateID":4,"terminalID":1},"state":true},{"t1":{"gateID":5,"terminalID":1},"t2":{"gateID":6,"terminalID":0},"state":false},{"t1":{"gateID":1,"terminalID":0},"t2":{"gateID":6,"terminalID":1},"state":false},{"t1":{"gateID":0,"terminalID":0},"t2":{"gateID":4,"terminalID":0},"state":false},{"t1":{"gateID":5,"terminalID":1},"t2":{"gateID":2,"terminalID":0},"state":false},{"t1":{"gateID":7,"terminalID":1},"t2":{"gateID":3,"terminalID":0},"state":true}],"canvasSize":{"width":700,"height":400}}
    }
  ]
}
