import levels from "../levels/LevelInterfaces";
import React from "react";
import {SamaggiButton} from "../Components/SamaggiButton";
import {CustomTypography} from "../Components/CustomTypography";
import {useLocation} from "react-router-dom";
import {Grid} from "@mui/material";
import {useTypedNavigate} from "./Pages";
import userData from "../UserData";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

const Tutorial: React.FC = (_) => {
    const navigate = useTypedNavigate();

    return (
        <Grid container direction={"column"} spacing={4}>
            <Grid item position={"absolute"}>
                <SamaggiButton colour={"#777777"} hoverColour={"#555555"} onClick={() => navigate("/intro")} startIcon={<KeyboardReturnIcon/>}>Back</SamaggiButton>
            </Grid>
            <Grid item>
                <CustomTypography center xlarge bold>Tutorial</CustomTypography>
            </Grid>
            <Grid item container direction={"column"} spacing={2}>
                <iframe width="100%" height="700px" src="https://brycepy.github.io/logic-gate-js/example_tutorial.html" title="Tutorial" frameBorder="0" allowFullScreen></iframe>
            </Grid>
        </Grid>
    );
}

export default Tutorial;