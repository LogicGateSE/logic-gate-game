import React, {useContext, useState} from "react";
import {Grid} from "@mui/material";
import {CustomTypography} from "../Components/CustomTypography";
import {SamaggiButton} from "../Components/SamaggiButton";
import levels from "../levels/LevelInterfaces";
import {useLocation} from "react-router-dom";
import {SolutionContext} from "../Main";
import {useTypedNavigate} from "./Pages";
import userData from "../UserData";

export interface ReviewState {
    levelIndex: number;
    worldIndex: number;
    timeElapsed: number;
}

export const Review: React.FC = (_) => {
    const navigate = useTypedNavigate();
    const state: ReviewState = useLocation().state;

    const [solution, ] = useContext(SolutionContext);
    const level = levels[state.worldIndex].levels[state.levelIndex];

    let stars = "";
    level.starRequirements.forEach((starReq) => {
        stars += starReq.f(solution, state.timeElapsed) ? "S" : "N";
        userData.setAttempt(level.levelID, "stars", stars);
    }); 

    return <>
        <Grid container direction="column" spacing={2}>
            <Grid item container direction={"column"}>
                <Grid item>
                    <CustomTypography xlarge center>Level {level.levelComplete(solution) ? "Complete" : "Failed"}</CustomTypography>
                </Grid>
                <Grid item>
                    <CustomTypography center>{level.levelName}</CustomTypography>
                </Grid>
            </Grid>
            {level.levelComplete(solution) && <Grid item container direction={"row"} spacing={4}>
                {level.starRequirements.map((starReq) => (
                    <Grid item container direction={"column"} spacing={2} xs={Math.floor(12/level.starRequirements.length)}>
                        <Grid item>
                            <CustomTypography large bold>
                                {starReq.f(solution, state.timeElapsed) ? "S" : "N"}
                            </CustomTypography>
                        </Grid>
                        <Grid item>
                            <CustomTypography small>
                                {starReq.description}
                            </CustomTypography>
                        </Grid>
                    </Grid>
                ))}
            </Grid>}
            {!level.levelComplete(solution) && <Grid item>
                <CustomTypography large center>Level Not Complete</CustomTypography>
            </Grid>}
            <Grid item container direction={"row"} spacing={4}>
                <Grid item xs={6}>
                    <SamaggiButton fullWidth onClick={() => {navigate("/play", {state: {worldIndex: state.worldIndex, levelIndex: state.levelIndex}})}}>Restart</SamaggiButton>
                </Grid>
                <Grid item xs={6}>
                    <SamaggiButton fullWidth onClick={() => {navigate("/level-select", {state: {worldIndex: state.worldIndex}})}}>Go to Map</SamaggiButton>
                </Grid>
            </Grid>
        </Grid>
    </>
}