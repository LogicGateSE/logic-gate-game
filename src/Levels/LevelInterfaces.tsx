import LevelAnd from "./basic/and";
import LevelNone from "./basic/none";
import LevelOr from "./basic/or";
import LevelNot from "./basic/not";
import LevelLatch from "./others/latch";
import LevelFullAdder from "./others/fulladder";

import LevelSmartHome1 from "./smart_home/smart_home1";
import LevelSmartHome2 from "./smart_home/smart_home2";
import LevelSmartHome3 from "./smart_home/smart_home3";


import React, {PropsWithChildren} from "react";
import {CustomTypography} from "../Components/CustomTypography";

export type EvaluateFunction = ((inputs: Array<boolean>, instant?: boolean) => Array<boolean>)

export interface TSSolution {
    numGate: number;
    evaluateSync: EvaluateFunction;
}

export type TruthTableRow = {inputs: Array<boolean>, outputs: Array<boolean>};

export interface StarRequirement {
    f: (world: TSSolution, timeElapsed: number) => boolean
    description: string
}

export function stringTaskWrapper(data: React.FC<PropsWithChildren> | string): React.FC<PropsWithChildren> {
    if (typeof data === "string") {
        return () => {
            return (<CustomTypography>{data as string}</CustomTypography>)
        };
    } else {
        return data
    }
}

export function truthTableWrapper(data: (() => Array<TruthTableRow>) | Array<TruthTableRow>) {
    if (typeof data === "function"){
        return data;
    } else {
        return (() => {return data as Array<TruthTableRow>;});
    }
}

// TODO: Create function for default is correct check

export interface LevelData {
    readonly starRequirements: Array<StarRequirement>;
    readonly levelName: string;
    readonly levelID: string;
    readonly levelTask: React.FC<PropsWithChildren> | string;
    readonly truthTable: (() => Array<TruthTableRow>) | Array<TruthTableRow>
    readonly inputs: Array<string>;
    readonly outputs: Array<string>;

    levelComplete(solution: TSSolution): boolean;

    readonly LevelTask: React.FC<PropsWithChildren>;
    readonly TruthTable: (() => Array<TruthTableRow>);
    oracles?: Array<Object>
}

type LevelCollection = {name: string, levels: Array<LevelData>}

let levels: Array<LevelCollection> = [
    {
        name: "basic", levels: [
            new LevelNone,
            new LevelAnd,
            new LevelOr,
            new LevelNot
        ]
    },
    {
        name: "Smart Home", levels: [
            new LevelSmartHome1,
            new LevelSmartHome2,
            new LevelSmartHome3
        ]
    },
    {
        name: "Temple of Julian", levels: []
    },
    {
        name: "others", levels: [
            new LevelLatch,
            new LevelFullAdder
        ]
    }
]


// root/level/basic/and

export default levels;