import React from "react";
import {CustomTypography} from "../Components/CustomTypography";
import levels from "../Levels/LevelInterfaces";
import {SamaggiButton} from "../Components/SamaggiButton";
import {Grid} from "@mui/material";
import {useTypedNavigate} from "./Pages";

const WorldSelect: React.FC = (_) => {
    const navigate = useTypedNavigate();

    return (<Grid container direction={"column"} spacing={4}>
        <Grid item>
            <CustomTypography center xlarge bold>Logic Gate Worlds</CustomTypography>
        </Grid>
        <Grid item container direction={"column"} spacing={2}>
            {levels.map((world, index) => (<>
                <Grid item>
                    <SamaggiButton fullWidth onClick={() => navigate("/level-select", {state: {worldIndex: index}})}> {world.name} </SamaggiButton>
                </Grid>
            </>))}
        </Grid>
        <Grid item>
            <SamaggiButton fullWidth colour={"#777777"} hoverColour={"#555555"} onClick={() => navigate("/intro")}>Back to Main Menu</SamaggiButton>
        </Grid>
    </Grid>);
}

export default WorldSelect;