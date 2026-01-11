import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserPanel from './UserPanel';
import Cart from './Cart';
import Cennik from './Cennik';
import MyRentals from './MyRentals';
import MyFines from './MyFines';
import AdminCopy from './AdminCopy';
import MyReservations from './MyReservations';
import AdminFilms from './AdminFilms';
import UserProfile from './UserProfile';
import AdminPanel from './AdminPanel';
import AdminReturns from './AdminReturns';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('role'));
  //const userRole = (localStorage.getItem('rola') || '').toLowerCase();
  const getRole = () => (localStorage.getItem('rola') || '').toLowerCase();
  const staffRoles = ['admin', 'pracownik', 'kasjer', 'kierownik'];


  // Nasłuch zmian w localStorage (np. wylogowanie w innej zakładce)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn
                ? (staffRoles.includes(getRole())
                    ? <Navigate to="/admin" /> : <Navigate to="/panel" />)
              : <LoginPage setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/register"
          element={
            isLoggedIn
              ? <Navigate to="/panel" />
              : <RegisterPage />
          }
        />

        <Route
          path="/panel"
          element={
            isLoggedIn
              ? <UserPanel setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/cart"
          element={
            isLoggedIn
              ? <Cart setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/cennik"
          element={
            isLoggedIn
              ? <Cennik setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/my-rentals"
          element={
            isLoggedIn
              ? <MyRentals setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/my-fines"
          element={
            isLoggedIn
              ? <MyFines setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/my-reservations"
          element={
            isLoggedIn
              ? <MyReservations setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/profile"
          element={
            isLoggedIn
              ? <UserProfile setIsLoggedIn={setIsLoggedIn} login={localStorage.getItem('login')} />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin"
            element={
              isLoggedIn && staffRoles.includes(getRole())
                ? <AdminPanel setIsLoggedIn={setIsLoggedIn} />
                : <Navigate to="/" />
            }
        />

        <Route
          path="/admin/zwroty"
            element={
              isLoggedIn && staffRoles.includes(getRole())
                ? <AdminReturns setIsLoggedIn={setIsLoggedIn} />
                : <Navigate to="/" />
            }
        />

        <Route
          path="/admin/egzemplarze"
            element={
              isLoggedIn && staffRoles.includes(getRole())
                ? <AdminCopy setIsLoggedIn={setIsLoggedIn} />
                : <Navigate to="/" />
            }
        />

        <Route
          path="/admin/films"
            element={
              isLoggedIn && staffRoles.includes(getRole())
                ? <AdminFilms setIsLoggedIn={setIsLoggedIn} />
                : <Navigate to="/" />
            }
        />
      </Routes>
    </Router>
  );
}

export default App;
