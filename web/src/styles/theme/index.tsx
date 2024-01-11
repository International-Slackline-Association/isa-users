import { createTheme } from '@mui/material';

import { palette } from './palette';

export const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: 'Lato, sans-serif',
    body1: {
      letterSpacing: 0.04,
    },
    body2: {
      letterSpacing: 0.04,
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
});
