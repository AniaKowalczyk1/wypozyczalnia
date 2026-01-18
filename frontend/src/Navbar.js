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
          className={`nav-btn ${location.pathname === '/contact' ? 'active' : ''}`}
          onClick={() => navigate('/contact')}
        >
          Kontakt
        </button>

        <button
          className={`nav-btn ${location.pathname === '/my-rentals' ? 'active' : ''}`}
          onClick={() => navigate('/my-rentals')}
        >
          Wypożyczenia
        </button>

        <button
          className={`nav-btn ${location.pathname === '/my-reservations' ? 'active' : ''}`}
          onClick={() => navigate('/my-reservations')}
        >
          Rezerwacje
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

        {/* Profil jako ikona w kółku */}
        <button
          className="profile-btn"
          onClick={() => navigate('/profile')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
