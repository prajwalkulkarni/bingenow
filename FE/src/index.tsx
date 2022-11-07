import React from 'react';
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'
import { ContextProvider } from './context/Context';
const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(<ContextProvider><App /></ContextProvider>);