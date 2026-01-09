import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button
          className={`nav-btn ${location.pathname === '/panel' ? 'active' : ''}`}
          onClick={() => navigate('/panel')}
        >
          Filmy
        </button>

        <button
          className={`nav-btn ${location.pathname === '/cart' ? 'active' : ''}`}
          onClick={() => navigate('/cart')}
        >
          Koszyk
        </button>

        <button
          className={`nav-btn ${location.pathname === '/cennik' ? 'active' : ''}`}
          onClick={() => navigate('/cennik')}
        >
          Cennik
        </button>

        <button
          className={`nav-btn ${location.pathname === '/my-rentals' ? 'active' : ''}`}
          onClick={() => navigate('/my-rentals')}
        >
          Wypożyczenia
        </button>

         <button
            className={`nav-btn ${location.pathname === '/my-fines' ? 'active' : ''}`}
            onClick={() => navigate('/my-fines')}
          >
            Kary
         </button>



      </div>

      <div className="nav-right">
        <button className="logout-btn" onClick={handleLogout}>
          Wyloguj
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
