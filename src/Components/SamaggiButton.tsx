import {styled} from "@mui/material";
import Button from "@mui/material/Button";

export const SamaggiButton = styled(Button, {
    shouldForwardProp: (prop) => !["colour", "hoverColour", "textColour", "hoverTextColour"].includes(prop as string)
})<{ colour?: string, hoverColour?: string, textColour?: string, hoverTextColour?: string }>
(({colour = "#ff9031", hoverColour = "#a64704", textColour = "#FFFFFF", hoverTextColour = "#FFFFFF"}) => ({
    backgroundColor: colour,
    color: textColour,
    fontWeight: "600",
    borderRadius: "10px",
    minHeight: "45px",
    maxHeight: "65px",
    fontSize: "17px",
    borderWidth: "1px",
    borderColor: "#222222",
    boxShadow: "0 1px 3px #9E9E9E",
    "&:hover": {
        backgroundColor: hoverColour,
        color: hoverTextColour
    }
}))