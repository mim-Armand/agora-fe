import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#ff4c00',
    },
    success: {
      main: '#57c200'
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;