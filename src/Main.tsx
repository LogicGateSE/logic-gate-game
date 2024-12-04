import React from "react";
import {Route, Routes} from "react-router-dom";
import {PropsWithChildren, useState} from "react";
import {Grid, useMediaQuery} from "@mui/material";
import Intro from "./Pages/Intro";
import theme from "./theme";
import {SamaggiBackdrop} from "./Components/SamaggiBackdrop";
import SamaggiPaper from "./Components/SamaggiPaper";
import WorldSelect from "./Pages/WorldSelection";
import LevelSelect from "./Pages/LevelSelect";
import {Review} from "./Pages/Review";
import Play from "./Pages/Play";
import Solution from "./logicgate_back";
import Tutorial from "./Pages/Tutorial";

export interface BasicProps {
    mobile: boolean,
    vertical: boolean,
    setShowCover: React.Dispatch<React.SetStateAction<boolean>>
}

export interface MinimalProps {
    setShowCover: React.Dispatch<React.SetStateAction<boolean>>
}

export const SolutionContext = React.createContext<[Solution, React.Dispatch<React.SetStateAction<Solution>>]>(undefined);


export const Main: React.FC<PropsWithChildren<any>> = () => {
    // const mobile = useMediaQuery(theme.breakpoints.down("md"));
    // const vertical = useMediaQuery(theme.breakpoints.down("sm"));
    // const location = useLocation();
    // const navigate = useNavigate();
    // const [params,] = useSearchParams();
    const medScreen = useMediaQuery(theme.breakpoints.up('md'));

    const contextState = useState<Solution>(undefined);

    document.body.style.backgroundColor = "#c0c0c0";

    return (
        <SamaggiBackdrop open={false} noContainer={true}>
            <div>
                <Grid container direction={"column"} alignItems={"center"}>
                    <SamaggiPaper wide>
                        <Routes>
                            <Route path='/intro' element={<Intro/>}></Route>
                            <Route path='/world-select' element={<WorldSelect/>}></Route>
                            <Route path='/level-select' element={<LevelSelect/>}></Route>
                            <Route path='/review' element={<SolutionContext.Provider value={contextState}><Review/></SolutionContext.Provider>}></Route>
                            <Route path='/play' element={<SolutionContext.Provider value={contextState}><Play/></SolutionContext.Provider>}></Route>
                            <Route path='/tutorial' element={<Tutorial/>}></Route>
                            <Route path='/' element={<Intro/>}></Route>
                        </Routes>
                    </SamaggiPaper>
                </Grid>
            </div>
        </SamaggiBackdrop>
    )
}
