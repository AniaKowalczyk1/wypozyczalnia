import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ setIsLoggedIn }) {
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', { login, haslo });
      const data = response.data;

      // Zapis wszystkich danych klienta w localStorage
      localStorage.setItem('idKonta', data.idKonta);
      localStorage.setItem('idKlienta', data.idKlienta || '');
      localStorage.setItem('rola', data.rola || '');
      localStorage.setItem('imie', data.imie || '');
      localStorage.setItem('nazwisko', data.nazwisko || '');
      localStorage.setItem('adres', data.adres || '');
      localStorage.setItem('login', data.login || '');
      localStorage.setItem('email', data.email || '');

      localStorage.setItem('idFilii', data.idFilii || '');
      localStorage.setItem('nazwaFilii', data.nazwaFilii || '');

      setIsLoggedIn(true);

      const staffRoles = ['admin', 'pracownik', 'kasjer', 'kierownik'];
      if (staffRoles.includes(data.rola.toLowerCase())) {
        navigate('/admin');
      } else {
        navigate('/panel');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginMessage('Nieprawidłowy login lub hasło');
      } else {
        setLoginMessage('Błąd połączenia z serwerem');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Logowanie</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
          />

          {/* Pole hasła z możliwością pokazania/ukrycia */}
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Hasło"
              value={haslo}
              onChange={e => setHaslo(e.target.value)}
              required
            />
            <div
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94a10 10 0 0 1-11.88 0M1 1l22 22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </div>
          </div>

          <button type="submit">Zaloguj</button>
        </form>
        {loginMessage && <p className="login-message">{loginMessage}</p>}
        <p className="login-footer">
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
