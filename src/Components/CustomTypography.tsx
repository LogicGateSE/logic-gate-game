import {styled} from "@mui/system";
import {Typography} from "@mui/material";

export interface SamaggiTypographyProps {
    bold?: boolean
    center?: boolean
    colour?: Colours,
    large?: boolean,
    inline?: boolean,
    small?: boolean,
    strikethrough?: boolean
    xsmall?: boolean
    italic?: boolean
    xlarge?: boolean
    breakAnywhere?: boolean
}

export enum Size {
    normal = "inherit",
    large = "24px"
}

export enum Colours {
    black = "#000000",
    samaggiOrange = "#ff9031",
    samaggiBlue = "#293c7e",
    gray = "#9f9f9f",
    darkGray = "#646464",

    white = "#FFFFFF",

    red = "#b40606",

    darkRed = "#6c0101",

    green = "#008844",

    darkGreen = "#006622",

    yellow = "#f8c400",

    darkYellow = "#b68d00"
}

export const CustomTypography = styled(Typography, {
    shouldForwardProp: (prop) => !["bold", "center", "large", "inline", "strikethrough", "small", "xsmall", "italic", "colour", "xlarge", "breakAnywhere"].includes(prop as string)
}) <SamaggiTypographyProps> (({bold = false, center = false, large = false, xlarge = false, inline = false, strikethrough = false, small = false, xsmall = false, italic = false, colour = Colours.black, breakAnywhere = false}) => ({
    textAlign: center ? "center" : "left",
    fontWeight: bold ? "600": "400",
    color: colour,
    fontSize: xlarge ? "32px" : (large ? "24px": (small ? "16px" : (xsmall ? "14px" : "19px"))),
    fontStyle: italic ? "italic": "normal",
    display: inline ? "inline": "inherit",
    textDecorationLine: strikethrough? "line-through": "none",
    lineBreak: breakAnywhere ? "anywhere" : "initial"
}))