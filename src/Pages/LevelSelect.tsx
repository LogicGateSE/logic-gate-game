import levels from "../levels/LevelInterfaces";
import React from "react";
import {SamaggiButton} from "../Components/SamaggiButton";
import {CustomTypography} from "../Components/CustomTypography";
import {useLocation} from "react-router-dom";
import {Grid} from "@mui/material";
import {useTypedNavigate} from "./Pages";
import userData from "../UserData";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

export interface LevelSelectState {
    worldIndex: number;
}

const LevelSelect: React.FC = (_) => {
    const state: LevelSelectState = useLocation().state;
    const navigate = useTypedNavigate();

    return (
        <Grid container direction={"column"} spacing={4}>
            <Grid item>
                <CustomTypography center xlarge bold>{levels[state.worldIndex].name}</CustomTypography>
            </Grid>
            <Grid item container direction={"column"} spacing={2}>
                {levels[state.worldIndex].levels.map((level, index) => (
                    <Grid item>
                        <SamaggiButton fullWidth onClick={() => {
                            navigate("/play", {state: {worldIndex: state.worldIndex, levelIndex: index}})}
                        }> {level.levelID}: {level.levelName} {userData.hasAttempted(level.levelID)? "*":""} {userData.getAttempt(level.levelID, "stars")||""}</SamaggiButton>
                    </Grid>
                ))}
            </Grid>
            <Grid item>
                <SamaggiButton fullWidth colour={"#777777"} hoverColour={"#555555"} onClick={() => navigate("/world-select")} startIcon={<KeyboardReturnIcon/>}>Back</SamaggiButton>
            </Grid>
        </Grid>
    );
}

export default LevelSelect;