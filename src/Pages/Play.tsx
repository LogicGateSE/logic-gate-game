import LogicGateComponent from "../Components/LogicGateComponent";
import React, {useContext} from "react";
import levels from "../levels/LevelInterfaces";
import {useLocation} from "react-router-dom";
import {useTypedNavigate} from "./Pages";
import {CustomTypography} from "../Components/CustomTypography";
import {Button, Grid} from "@mui/material";
import {SamaggiButton} from "../Components/SamaggiButton";
import SamaggiPaper from "../Components/SamaggiPaper";
import {SolutionContext} from "../Main";
import userData from "../UserData";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



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

    const [testCaseOutput, setTestCaseOutput] = React.useState<Array<any>>([]);


    const logicGateComp: React.RefObject<any> = React.createRef();
    // const resultMessage: React.RefObject<any> = React.createRef();
    const [resultMessage, setResultMessage] = React.useState<string>("");

    const levelData = levels[state.worldIndex].levels[state.levelIndex];
    const inputs = levelData.inputs;
    const outputs = levelData.outputs;

    let timeBegin: Date = new Date();

    console.log("Inputs: ", inputs);
    console.log("Outputs: ", outputs);

    // run after loaded
    React.useEffect(() => {
        timeBegin = new Date();

        let logicCanvas = logicGateComp.current.logicCanvas;
        let world = logicCanvas.world; 
        world.clear();

        inputs.forEach((input) => {
            let gate = logicCanvas.createInput();
            gate.setLabel(input);
        });
        outputs.forEach((output) => {
            let gate = logicCanvas.createOutput();
            gate.setLabel(output);
        });

        let userAttemptCanvas = userData.getAttempt(levelData.levelID, "canvas");
        console.log("User attempt: ", userAttemptCanvas);
        if (userAttemptCanvas) {
            setTimeout(() => {
                logicCanvas.load(userAttemptCanvas);
                inputs.forEach((input, index) => {
                    world.inputs[index].setLabel(input);
                });
                outputs.forEach((output, index) => {
                    world.outputs[index].setLabel(output);
                });
                console.log("Loaded user attempt");
                logicCanvas.showWireFrame();
            }, 100);
        }

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

        userData.setAttempt(levelData.levelID, "canvas", logicCanvas.export());

        setResultMessage("Evaluating...");
        let testCases = levelData.TruthTable();
        let result = {
            correct: true,
            message: "Not yet implemented",
        }

        setTestCaseOutput([]);
        let tmp = [];

        for(let i=0; i < testCases.length; i++) {
            let inputs = testCases[i].inputs;
            let outputs = testCases[i].outputs;
            let actualOutputs = await world.evaluate(
                inputs,
                animated? undefined: true
            );

            tmp.push([...inputs, ...outputs, ...actualOutputs]);
            setTestCaseOutput([...tmp]);

            console.log(tmp);

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
                    result.message = `Output mismatch at test case, inputs: ${inputs}, expected: ${outputs}, got: ${actualOutputs}`;
                    break;
                }
            }
            if(!result.correct) {
                break;
            }else{
                result.message = "All test cases passed";
            }
        }
        setResultMessage(result.message);

        setCorrectAnswer(result.correct);
        setSolution(logicCanvas.world);
    }

    const handleClear = () => {
        let logicCanvas = logicGateComp.current.logicCanvas;
        let world = logicCanvas.world;
        world.clearNonIO();
    }

    function goToReview() {
        navigate("/review", {state: {worldIndex: state.worldIndex, levelIndex: state.levelIndex, timeElapsed: ((new Date()).getTime() - timeBegin.getTime()) / 1000}});
    }

    // const rows = [
    // createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    // createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    // createData('Eclair', 262, 16.0, 24, 6.0),
    // createData('Cupcake', 305, 3.7, 67, 4.3),
    // createData('Gingerbread', 356, 16.0, 49, 3.9),
    // ];
    
    return (
        <Grid container direction="column" spacing={3}>
            <Grid item xs={1} position={"absolute"}>
                <SamaggiButton onClick={handleBack} startIcon={<KeyboardReturnIcon/>} size="small" style={{backgroundColor:"#444"}}>BACK</SamaggiButton>
            </Grid>
            <Grid item>
                <CustomTypography center large bold>Logic Gate Level: {levelData.levelName}</CustomTypography>
            </Grid>
            <Grid item sx={{width: "100%"}} justifyContent="center" alignItems="center">
                <LogicGateComponent ref={logicGateComp}></LogicGateComponent>
            </Grid>
            {/* <Grid item>
                <LogicGateComponent ref={logicGateComp}></LogicGateComponent>
            </Grid> */}
            <Grid item container direction={"row"} spacing={2} style={{marginTop: "-8%"}}>
                <Grid item xs={2}>
                    <SamaggiButton fullWidth onClick={() => handleAddGate("AND")}>AND</SamaggiButton>
                </Grid>
                <Grid item xs={2}>
                    <SamaggiButton fullWidth onClick={() => handleAddGate("OR")}>OR</SamaggiButton>
                </Grid>
                <Grid item xs={2}>
                    <SamaggiButton fullWidth onClick={() => handleAddGate("NOT")}>NOT</SamaggiButton>
                </Grid>
                <Grid item xs={2}>
                    <SamaggiButton fullWidth onClick={() => handleAddGate("XOR")}>XOR</SamaggiButton>
                </Grid>
                <Grid item xs={2}>
                    <SamaggiButton fullWidth onClick={() => handleAddGate("NAND")}>NAND</SamaggiButton>
                </Grid>
                <Grid item xs={2}>
                    <SamaggiButton fullWidth onClick={() => handleClear()} startIcon={<DeleteIcon />} style={{backgroundColor:"rgb(144, 202, 249)", color:"rgba(0, 0, 0, 0.87)"}}>Clear</SamaggiButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <SamaggiPaper internal>
                    <levelData.LevelTask/>
                </SamaggiPaper>
            </Grid>
            <Grid item spacing={4}>
                <SamaggiPaper internal>
                    {/* <levelData.LevelTask/> */}
                    <CustomTypography>{resultMessage}</CustomTypography>

                    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table" style={{ tableLayout: 'fixed', backgroundColor: "#aaa", border:'1px solid gray'}}>
        <TableBody>
        <TableRow style={{backgroundColor: "#ccc"}}>
           {inputs.map((input) => (
              <TableCell align="center">{input}</TableCell>
            ))}
            {outputs.map((output) => (
              <TableCell align="center">expected-{output}</TableCell>
            ))}
            {outputs.map((output) => (
              <TableCell align="center">circuit-{output}</TableCell>
            ))}
          </TableRow>
          {testCaseOutput.map((row) => (
            <TableRow style={{height:"50px"}}>
                {row.map((data) => (
                    <TableCell align="right">
                        <div style={{backgroundColor: data?"white":"black", width:"50px", height:"50px", marginLeft:"auto", marginRight:"auto", borderRadius:"50%"}}/>
                    </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

                </SamaggiPaper>
                </Grid>
            {!correctAnswer && <Grid item container direction={"column"}>
                <Grid item container direction={"row"} spacing={2} xs={12}>
                    <Grid item xs={6}>
                        <SamaggiButton fullWidth onClick={() => handleSubmit(false)}>Submit</SamaggiButton>
                    </Grid>
                    <Grid item xs={6}>
                        <SamaggiButton fullWidth onClick={() => handleSubmit(true)}>Submit Animated</SamaggiButton>
                    </Grid>
                </Grid>
            </Grid>}
            {correctAnswer && <Grid item>
                <SamaggiButton fullWidth onClick={() => goToReview()}>View your Results</SamaggiButton>
            </Grid>}
        </Grid>
    );
}
