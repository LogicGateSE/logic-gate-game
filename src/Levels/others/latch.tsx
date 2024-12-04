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
}
