import { createTheme } from "@mui/material/styles";
import "@fontsource/montserrat";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";

const theme = createTheme({
    typography: {
        fontFamily: [
            'Montserrat'
        ].join(','),
        button: {
            textTransform: 'none'
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 2000,
        },
    },
});


export default theme;
