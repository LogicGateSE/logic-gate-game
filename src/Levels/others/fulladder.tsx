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
  readonly inputs: Array<string> = ["A", "B", "C IN"];
  readonly outputs: Array<string> = ["S", "C OUT"];

  private starOne(_: TSSolution): boolean {
    return true;
  }

  private starTwo(world: TSSolution): boolean {
    return world.numGate === 5;
  }

  private starThree(_: TSSolution, timeElapsed: number): boolean {
    return timeElapsed < 300;
  }
  readonly levelID: string = "FULLADDER";
  readonly levelName: string = "Full Adder";

  readonly myStyle: CSS.Properties = {
    'width': '400px',
    'marginLeft': 'auto',
    'marginRight': 'auto',
    'display': 'block'
  }

  readonly levelTask: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div>
      <p>
      <b>What is a Full Adder?</b> - A full adder is a combinational logic circuit used to perform binary addition. 
      
      <br/><br/>It takes three inputs:<br/>
<b>A</b>: First binary digit.<br/>
<b>B</b>: Second binary digit.<br/>
<b>Carry-in (Cin)</b>: Carry from a previous addition.<br/>
<br/>It produces two outputs:<br/>

<b>Sum (S)</b>: The binary sum of the inputs.<br/>
<b>Carry-out (Cout)</b>: The carry generated by the addition, passed to the next stage in multi-bit addition.<br/>

<img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Full-adder.svg/1280px-Full-adder.svg.png"} style={this.myStyle}></img>


<br/><b>Why is it important?</b> - Full adders are the building blocks for constructing arithmetic circuits in digital systems, such as CPUs and ALUs. When chained together, they enable the addition of multi-bit binary numbers, a core operation in computing.

      {/* <link rel="Read More" href="https://en.wikipedia.org/wiki/Adder_(electronics)#Full_adder"/> */}

      <br/><br/>
      <a href="https://en.wikipedia.org/wiki/Adder_(electronics)#Full_adder" style={{textAlign: "right", display: "inline-block", width: "100%"}}>Read More</a>

      </p>
    </div>
  );
    // "Create a full adder!";

  
  readonly starRequirements: Array<StarRequirement>;

  constructor() {
    this.starRequirements = [
      { f: this.starOne, description: "Correct Solution" },
      { f: this.starTwo, description: "Uses Five Gates" },
      { f: this.starThree, description: "< 5 minutes" },
    ];
  }

  readonly truthTable: (() => Array<TruthTableRow>) | Array<TruthTableRow> =
    () => {
      return [
        { inputs: [false, false, false], outputs: [false, false] },
        { inputs: [false, false, true], outputs: [true, false] },
        { inputs: [false, true, false], outputs: [true, false] },
        { inputs: [false, true, true], outputs: [false, true] },
        { inputs: [true, false, false], outputs: [true, false] },
        { inputs: [true, false, true], outputs: [false, true] },
        { inputs: [true, true, false], outputs: [false, true] },
        { inputs: [true, true, true], outputs: [true, true] },
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
}
// import {
//   LevelData,
//   StarRequirement,
//   stringTaskWrapper,
//   TruthTableRow,
//   truthTableWrapper,
//   TSSolution
// } from "../LevelInterfaces";
// import React, {PropsWithChildren} from "react";

// export default class Level implements LevelData {
//   readonly inputs: Array<string> = ["S", "R"];
//   readonly levelID: string = "SRL";
//   readonly levelName: string = "SR Latch";
//   readonly levelTask: React.FC<React.PropsWithChildren> | string = "Make an SR latch!";
//   readonly outputs: Array<string> = ["Q", "Q"];
//   readonly starRequirements: Array<StarRequirement> = [];
//   readonly truthTable: (() => Array<TruthTableRow>) | Array<TruthTableRow> = () => {
//     return [
//       {inputs: [false, true], outputs: [true, false]},
//       {inputs: [false, false], outputs: [true, false]},
//       {inputs: [true, false], outputs: [false, true]},
//       {inputs: [false, false], outputs: [false, true]},
//       {inputs: [true, true], outputs: [false, false]},
//     ];
//   };

//   get LevelTask(): React.FC<PropsWithChildren> {
//     return stringTaskWrapper(this.levelTask)
//   }

//   get TruthTable(): (() => Array<TruthTableRow>) {
//     return truthTableWrapper([])
//   }

//   levelComplete(world: TSSolution): boolean {
//     return false;
//   }
// }

// let levelLatch = {
//   inputs: [
//     "S",
//     "R"
//   ],
//   outputs: [
//     "Q",
//     "Q'"
//   ],
//   text: "Make a latch",
//   testCasesGen:
// };
//
// export default levelLatch;
