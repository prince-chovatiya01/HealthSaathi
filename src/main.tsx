// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );



import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { HealthSaathiProvider } from './context/HealthSaathiContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HealthSaathiProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HealthSaathiProvider>
  </StrictMode>
);


