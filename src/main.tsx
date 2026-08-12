import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WorkProvider } from './context/WorkContext';
import { ThemeProvider } from './components/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <WorkProvider>
        <App />
      </WorkProvider>
    </ThemeProvider>
  </StrictMode>,
);
