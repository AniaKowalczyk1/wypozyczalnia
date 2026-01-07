import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Możesz użyć tego samego CSS, bo układ jest podobny

function AdminNavbar({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const role = (localStorage.getItem('rola') || '').toUpperCase();

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="navbar" style={{ backgroundColor: '#2c3e50' }}> {/* Ciemniejszy kolor dla odróżnienia */}
            <div className="nav-left">
        <span className="nav-brand" style={{ color: 'white', marginRight: '30px', fontWeight: 'bold' }}>
          PANEL ZARZĄDZANIA
        </span>
                <button className="nav-btn active" onClick={() => navigate('/admin')}>
                    Egzemplarze
                </button>
                {/* Tu w przyszłości dodasz np. <button>Użytkownicy</button> */}
            </div>

            <div className="nav-right">
        <span style={{ color: '#ecf0f1', marginRight: '20px' }}>
          Pracownik: <strong>{role}</strong>
        </span>
                <button className="logout-btn" onClick={handleLogout} style={{ backgroundColor: '#e74c3c' }}>
                    Wyloguj
                </button>
            </div>
        </nav>
    );
}

export default AdminNavbar;