import { styled } from "@mui/system";
import Paper from "@mui/material/Paper";
import theme from "../theme";

export interface SamaggiPaperProps {
    vertical?: boolean,
    mobile?: boolean,
    wide?: boolean,
    noPad?: boolean,
    internal?: boolean
}

const SamaggiPaper = styled(Paper, {
    shouldForwardProp: (prop) => !["vertical", "mobile", "wide", "noPad", "internal"].includes(prop as string)
}) <SamaggiPaperProps> (({vertical, mobile, wide = false, noPad = false, internal = false}) => ({
    padding: noPad? "0" : "30px",
    borderRadius: `${theme.shape.borderRadius * 5}px ! important`,
    marginTop: internal ? 0 : (mobile ? "30px" : "50px"),
    marginLeft: internal ? "auto" : (vertical ? "2vw" : "10px"),
    marginRight: internal ? "auto" : (vertical ? "2vw" : "10px"),
    marginBottom: internal ? 0 : (mobile ? "30px" : "50px"),
    width: internal? "100%" : (wide? "800px" : "425px"),
    maxWidth: "86vw",
    boxSizing: "border-box"
}))

export default SamaggiPaper

