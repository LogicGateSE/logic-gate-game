import LogicGateComponent from "../Components/LogicGateComponent";
import React, {useContext} from "react";
import levels from "../levels/LevelInterfaces";
import {useLocation} from "react-router-dom";
import {useTypedNavigate} from "./Pages";
import {CustomTypography} from "../Components/CustomTypography";
import {Grid} from "@mui/material";
import {SamaggiButton} from "../Components/SamaggiButton";
import SamaggiPaper from "../Components/SamaggiPaper";
import {SolutionContext} from "../Main";

export interface LogicGateLevelState {
    levelIndex: number;
    worldIndex: number;
}

export default function Play(_) {
    const state: LogicGateLevelState = useLocation().state;
    const navigate = useTypedNavigate();
    const location = useLocation();

    const [correctAnswer, setCorrectAnswer] = React.useState<boolean>(false);
    const [, setSolution] = useContext(SolutionContext);

    const logicGateComp: React.RefObject<any> = React.createRef();
    const resultMessage: React.RefObject<any> = React.createRef();
    let logicCanvas = null;
    let world = null;

    const levelData = levels[state.worldIndex].levels[state.levelIndex];
    let inputs = levelData.inputs;
    let outputs = levelData.outputs;

    let timeBegin: Date = new Date();

    console.log("Inputs: ", inputs);
    console.log("Outputs: ", outputs);

    // run after loaded
    React.useEffect(() => {
        timeBegin = new Date();

        logicCanvas = logicGateComp.current.logicCanvas;
        world = logicCanvas.world;
        inputs.forEach((input) => {
            let gate = logicCanvas.createInput();
            gate.setLabel(input);
        });
        outputs.forEach((output) => {
            let gate = logicCanvas.createOutput();
            gate.setLabel(output);
        });
        logicCanvas.showWireFrame();
    }, [location]);

    const handleBack = () => {
        navigate("/level-select", {state: {worldIndex: state.worldIndex}});
    };

    const handleAddGate = (type) => {
        console.log("Adding gate: " + type);
        let logicCanvas = logicGateComp.current.logicCanvas;
        logicCanvas.createGate(type);
        logicCanvas.showWireFrame();
    };

    const handleSubmit = async (animated) => {
        let logicCanvas = logicGateComp.current.logicCanvas;
        let world = logicCanvas.world;

        resultMessage.current.innerText = "Evaluating...";
        let testCases = levelData.TruthTable();
        let result = {
            correct: true,
            message: "Not yet implemented",
        }

        for(let i=0; i < testCases.length; i++) {
            let inputs = testCases[i].inputs;
            let outputs = testCases[i].outputs;
            let actualOutputs = await world.evaluate(
                inputs,
                animated? undefined: true
            );

            // outputs = outputs.map((x) => x ? 1 : 0);
            // actualOutputs = actualOutputs.map((x) => x ? 1 : 0);

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

        setCorrectAnswer(result.correct);
        setSolution(logicCanvas.world);
    }

    function goToReview() {
        navigate("/review", {state: {worldIndex: state.worldIndex, levelIndex: state.levelIndex, timeElapsed: ((new Date()).getTime() - timeBegin.getTime()) / 1000}});
    }


    return (
        <Grid container direction="column" spacing={3}
        alignItems="center"
        justifyContent="center">
            <Grid item>
                <CustomTypography large bold>Logic Gate Level</CustomTypography>
            </Grid>
            <Grid item>
                <LogicGateComponent ref={logicGateComp}></LogicGateComponent>
            </Grid>
            <Grid item>
                <LogicGateComponent ref={logicGateComp}></LogicGateComponent>
            </Grid>
            <Grid item container direction={"row"} spacing={2}>
                <Grid item xs={3}>
                    <SamaggiButton fullWidth onClick={() => handleAddGate("OR")}>OR</SamaggiButton>
                </Grid>
                <Grid item xs={3}>
                    <SamaggiButton fullWidth onClick={() => handleAddGate("AND")}>AND</SamaggiButton>
                </Grid>
                <Grid item xs={3}>
                    <SamaggiButton fullWidth onClick={() => handleAddGate("NOT")}>NOT</SamaggiButton>
                </Grid>
                <Grid item xs={3}>
                    <SamaggiButton fullWidth onClick={() => handleAddGate("XOR")}>XOR</SamaggiButton>
                </Grid>
            </Grid>
            <Grid item>
                <SamaggiPaper>
                    <levelData.LevelTask/>
                </SamaggiPaper>
            </Grid>
            {!correctAnswer && <Grid item container direction={"column"}>
                <Grid item container direction={"row"} spacing={2}>
                    <Grid item xs={6}>
                        <SamaggiButton fullWidth onClick={() => handleSubmit(false)}>Submit</SamaggiButton>
                    </Grid>
                    <Grid item xs={6}>
                        <SamaggiButton fullWidth onClick={() => handleSubmit(true)}>Submit Animated</SamaggiButton>
                    </Grid>
                </Grid>
                <Grid item>
                    <CustomTypography ref={resultMessage}></CustomTypography>
                </Grid>
            </Grid>}
            {correctAnswer && <Grid item>
                <SamaggiButton fullWidth onClick={() => goToReview()}>View your Results</SamaggiButton>
            </Grid>}
            <Grid item>
                <SamaggiButton fullWidth onClick={handleBack}>Back</SamaggiButton>
            </Grid>
        </Grid>
    );
}
