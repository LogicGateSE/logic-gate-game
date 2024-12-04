import React from "react";
import {CustomTypography} from "../Components/CustomTypography";
import {Grid} from "@mui/material";
import {SamaggiButton} from "../Components/SamaggiButton";
import {useNavigate} from "react-router-dom";


const Intro: React.FC = (_)=> {

    const navigate = useNavigate();

    const handleSettings = () => {};

    return (
        <Grid container direction={"column"} spacing={4}>
            <Grid item>
                <CustomTypography bold xlarge center>{"<NAME>"}</CustomTypography>
            </Grid>
            <Grid item container direction={"column"} spacing={2}>
                <Grid item>
                    <SamaggiButton fullWidth onClick={() => {navigate("/tutorial")}}>Tutorial</SamaggiButton>
                </Grid>
                <Grid item>
                    <SamaggiButton fullWidth onClick={() => {navigate("/world-select")}}>Start</SamaggiButton>
                </Grid>
                <Grid item>
                    <SamaggiButton fullWidth onClick={handleSettings}>Settings</SamaggiButton>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Intro;