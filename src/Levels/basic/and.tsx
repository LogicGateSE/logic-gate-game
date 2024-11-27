import {
	LevelData,
	StarRequirement,
	stringTaskWrapper,
	TruthTableRow,
	truthTableWrapper,
	TSSolution
} from "../LevelInterfaces";
import React, {PropsWithChildren} from "react";

export default class LevelAnd implements LevelData {
	readonly inputs: Array<string> = ["IN 1", "IN 2"];

	private starOne(_: TSSolution): boolean {
		return true
	}

	private starTwo(world: TSSolution): boolean {
		return world.numGate === 1
	}

	private starThree(_: TSSolution, timeElapsed: number): boolean {
		return timeElapsed < 120
	}

	readonly levelID: string = "And";
	readonly levelName: string = "AND";
	readonly levelTask: React.FC<React.PropsWithChildren> | string = "Use an AND gate to connect the inputs to the output.";
	readonly outputs: Array<string> = ["OUT"];
	readonly starRequirements: Array<StarRequirement>;

	constructor() {
		this.starRequirements = [
			{f: this.starOne, description: "Correct Solution"},
			{f: this.starTwo, description: "Uses One Gate"},
			{f: this.starThree, description: "< 2 minutes"},
		];
	}

	readonly truthTable: (() => Array<TruthTableRow>) | Array<TruthTableRow> = () => {
		return [
			{inputs: [false, false], outputs: [false]},
			{inputs: [false, true], outputs: [false]},
			{inputs: [true, false], outputs: [false]},
			{inputs: [true, true], outputs: [true]}
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
		return stringTaskWrapper(this.levelTask)
	}

	get TruthTable(): (() => Array<TruthTableRow>) {
		return truthTableWrapper(this.truthTable);
	}
}
//
// let level = {
// 	inputs: [
// 		"IN 1",
// 		"IN 2"
// 	],
// 	outputs: [
// 		"OUT"
// 	],
// 	text: "Use an AND gate to connect the inputs to the output",
// 	testCasesGen: ()=>{
// 		return [
// 			{inputs: [0, 0], outputs: [0]},
// 			{inputs: [0, 1], outputs: [0]},
// 			{inputs: [1, 0], outputs: [0]},
// 			{inputs: [1, 1], outputs: [1]}
// 		];
// 	}
// };
//
// export default Level;