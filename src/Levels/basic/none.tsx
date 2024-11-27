import {
  LevelData,
  StarRequirement,
  stringTaskWrapper,
  TruthTableRow,
  truthTableWrapper,
  TSSolution
} from "../LevelInterfaces";
import React, {PropsWithChildren} from "react";

export class LevelNone implements LevelData {
  readonly inputs: Array<string> = ["IN"];

  private starOne(_: TSSolution): boolean {
    return true
  }

  private starTwo(world: TSSolution): boolean {
    return world.numGate === 0
  }

  private starThree(_: TSSolution, timeElapsed: number): boolean {
    return timeElapsed < 120
  }

  readonly levelID: string = "NO";
  readonly levelName: string = "No gate";
  readonly levelTask: React.FC<React.PropsWithChildren> | string = "Connect the input to the output.";
  readonly outputs: Array<string> = ["OUT"];
  readonly starRequirements: Array<StarRequirement>;

  constructor() {
    this.starRequirements = [
      {f: this.starOne, description: "Correct Solution"},
      {f: this.starTwo, description: "Uses 0 Gate"},
      {f: this.starThree, description: "< 2 minutes"},
    ];
  }

  readonly truthTable: (() => Array<TruthTableRow>) | Array<TruthTableRow> = () => {
    return [
      {inputs: [false], outputs: [false]},
      {inputs: [true], outputs: [true]}
    ];
  };

  public levelComplete(world: TSSolution) {
    let workingTable: () => Array<TruthTableRow> = this.TruthTable

    workingTable().forEach((row) => {
      if (!world.evaluateSync(row.inputs, true)) {
        return false
      }
    })

    return true
  }

  get LevelTask(): React.FC<PropsWithChildren> {
    return stringTaskWrapper(this.levelTask);
  }

  get TruthTable(): (() => Array<TruthTableRow>) {
    return truthTableWrapper(this.truthTable);
  }
}

export default LevelNone;