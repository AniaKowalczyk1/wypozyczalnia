import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function AdminNavbar({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const [nazwaFilii, setNazwaFilii] = useState('Ładowanie...');
    const role = (localStorage.getItem('rola') || '').toUpperCase();
    const adminFiliaId = localStorage.getItem('idFilii');

    useEffect(() => {
        const fetchBranchName = async () => {
            try {
                const res = await axios.get('http://localhost:8082/api/filie');

                if (res.data && Array.isArray(res.data)) {
                    const mojaFilia = res.data.find(f => String(f.idFilii) === String(adminFiliaId));

                    if (mojaFilia) {
                        setNazwaFilii(mojaFilia.nazwa);
                        localStorage.setItem('nazwaFilii', mojaFilia.nazwa);
                    } else {
                        setNazwaFilii(`Filia nr ${adminFiliaId}`);
                    }
                }
            } catch (err) {
                console.error("Błąd pobierania nazwy filii:", err);
                setNazwaFilii(`Filia nr ${adminFiliaId}`);
            }
        };

        if (adminFiliaId) {
            fetchBranchName();
        }
    }, [adminFiliaId]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="navbar" style={{ backgroundColor: '#2c3e50' }}>
            <div className="nav-left">
                <span className="nav-brand" style={{ color: 'white', marginRight: '30px', fontWeight: 'bold' }}>
                    PANEL ZARZĄDZANIA
                </span>
                <button className="nav-btn active" onClick={() => navigate('/admin')}>
                    Wypożycz stacjonarnie
                </button>
                <button className="nav-btn active" onClick={() => navigate('/admin/zwroty')}>
                    Zwroty
                </button>
                <button className="nav-btn active" onClick={() => navigate('/admin/egzemplarze')}>
                    Egzemplarze
                </button>
                <button className="nav-btn active" onClick={() => navigate('/admin/films')}>
                    Filmy
                </button>
            </div>

            <div className="nav-right">
                <div style={{ color: '#ecf0f1', marginRight: '20px', textAlign: 'right', lineHeight: '1.2' }}>
                    <div style={{ fontSize: '12px', color: '#bdc3c7' }}>Zalogowany jako:</div>
                    <div>
                        <strong>{role}</strong> | <span>📍 {nazwaFilii}</span>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout} style={{ backgroundColor: '#e74c3c' }}>
                    Wyloguj
                </button>
            </div>
        </nav>
    );
}

export default AdminNavbar;