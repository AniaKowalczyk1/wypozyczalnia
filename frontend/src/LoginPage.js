import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ setIsLoggedIn }) {
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
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

      setIsLoggedIn(true);

      navigate('/panel'); // przekierowanie do panelu użytkownika
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
          <input
            type="password"
            placeholder="Hasło"
            value={haslo}
            onChange={e => setHaslo(e.target.value)}
            required
          />
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
