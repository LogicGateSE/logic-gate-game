import {
  LevelData,
  StarRequirement,
  stringTaskWrapper,
  TruthTableRow,
  truthTableWrapper,
  TSSolution,
} from "../LevelInterfaces";
import React, { PropsWithChildren } from "react";

export default class LevelNot implements LevelData {
  readonly inputs: Array<string> = ["IN"];

  private starOne(_: TSSolution): boolean {
    return true;
  }

  private starTwo(world: TSSolution): boolean {
    return world.numGate === 1;
  }

  private starThree(_: TSSolution, timeElapsed: number): boolean {
    return timeElapsed < 120;
  }

  readonly levelID: string = "Not";
  readonly levelName: string = "NOT";
  readonly levelTask: React.FC<React.PropsWithChildren> | string =
    "Use a NOT gate to invert the input.";
  readonly outputs: Array<string> = ["OUT"];
  readonly starRequirements: Array<StarRequirement>;

  constructor() {
    this.starRequirements = [
      { f: this.starOne, description: "Correct Solution" },
      { f: this.starTwo, description: "Uses One Gate" },
      { f: this.starThree, description: "< 2 minutes" },
    ];
  }

  readonly truthTable: (() => Array<TruthTableRow>) | Array<TruthTableRow> =
    () => {
      return [
        { inputs: [false], outputs: [true] },
        { inputs: [true], outputs: [false] },
      ];
    };

  public levelComplete(world: TSSolution) {
    let workingTable: () => Array<TruthTableRow> = this.TruthTable;

    workingTable().forEach((row) => {
      if (!world.evaluateSync(row.inputs, true)) {
        return false;
      }
    });

    return true;
  }

  get LevelTask(): React.FC<PropsWithChildren> {
    return stringTaskWrapper(this.levelTask);
  }

  get TruthTable(): () => Array<TruthTableRow> {
    return truthTableWrapper(this.truthTable);
  }
}
