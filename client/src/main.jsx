import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import { TradeProvider } from './context/TradeProvider.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TradeProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>        
      </TradeProvider>
    </AuthProvider>
  </StrictMode>,
);
