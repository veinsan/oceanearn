import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage  from './pages/public/LandingPage';
import SignInPage   from './pages/public/SignInPage';
import RegisterPage from './pages/public/RegisterPage';
import { useAuth }  from './hooks/useAuth';

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={user ? <Navigate to="/" replace /> : <SignInPage />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;