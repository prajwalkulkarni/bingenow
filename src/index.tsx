import React from 'react';
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'
import { ContextProvider } from './context/Context';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#5b21b6',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
  },
});

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(<ContextProvider><ThemeProvider theme={theme}><App /></ThemeProvider></ContextProvider>);