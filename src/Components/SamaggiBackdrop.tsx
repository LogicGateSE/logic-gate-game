import {Backdrop, BackdropProps, CircularProgress} from "@mui/material";
import theme from "../theme";
import React from "react";

export const SamaggiBackdrop: React.FC<BackdropProps & {noContainer?: boolean}> = ({open, children, noContainer}) => {
    return (
        <div style={{"position": "relative"}}>
            <Backdrop sx={{color: "#FFFFFF", zIndex: (theme) => theme.zIndex.drawer + 1, position: "absolute", backgroundColor: noContainer ? "#fbfbfb" : "white", borderRadius: `${noContainer ? 0 : theme.shape.borderRadius * 5}px ! important`}} open={open}>
                {open && <CircularProgress color="warning"/>}
            </Backdrop>
            <div style={{padding: noContainer ? (open ? "5px" : "0px") : "30px", minHeight: "50px", maxHeight: open ? "80vh" : "initial", overflow: "hidden"}}>
                {children}
            </div>
        </div>
    );
}

