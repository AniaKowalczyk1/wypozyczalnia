import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserPanel from './UserPanel';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('role'));

  // Nasłuch zmian w localStorage (np. wylogowanie w innym zakładce)
  useEffect(() => {
    const handleStorageChange = () => setIsLoggedIn(!!localStorage.getItem('role'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/panel" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/panel" /> : <RegisterPage />}
        />
        <Route
          path="/panel"
          element={isLoggedIn ? <UserPanel setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
