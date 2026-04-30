import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Root = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Root />
      </GoogleOAuthProvider>
    ) : (
      <Root />
    )}
  </StrictMode>
);