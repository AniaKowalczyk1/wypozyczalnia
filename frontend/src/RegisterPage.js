import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [adres, setAdres] = useState('');
  const [regLogin, setRegLogin] = useState('');
  const [email, setEmail] = useState('');
  const [regHaslo, setRegHaslo] = useState('');
  const [regMessage, setRegMessage] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    if (!nameRegex.test(imie)) return "Imię może zawierać tylko litery, spacje i myślniki";
    if (!nameRegex.test(nazwisko)) return "Nazwisko może zawierać tylko litery, spacje i myślniki";
    if (regLogin.length < 4) return "Login musi mieć co najmniej 4 znaki";
    if (regHaslo.length < 6) return "Hasło musi mieć co najmniej 6 znaków";
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return "Niepoprawny format email";
    if (adres.length < 5) return "Adres musi mieć co najmniej 5 znaków";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setRegMessage(validationError);
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        imie, nazwisko, adres, login: regLogin, email, haslo: regHaslo
      });

      setRegMessage('Rejestracja zakończona sukcesem! Przekierowanie do logowania...');
      setImie(''); setNazwisko(''); setAdres('');
      setRegLogin(''); setEmail(''); setRegHaslo('');

      setTimeout(() => navigate('/'), 500);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setRegMessage(error.response.data.message);
      } else if (error.response && error.response.status === 409) {
        setRegMessage('Login lub email jest już zajęty');
      } else {
        setRegMessage('Błąd połączenia z serwerem');
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Rejestracja</h2>
        <form onSubmit={handleRegister} className="register-form">
          <input type="text" placeholder="Imię" value={imie} onChange={e => setImie(e.target.value)} required />
          <input type="text" placeholder="Nazwisko" value={nazwisko} onChange={e => setNazwisko(e.target.value)} required />
          <input type="text" placeholder="Adres" value={adres} onChange={e => setAdres(e.target.value)} required />
          <input type="text" placeholder="Login" value={regLogin} onChange={e => setRegLogin(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Hasło" value={regHaslo} onChange={e => setRegHaslo(e.target.value)} required />
          <button type="submit">Zarejestruj</button>
        </form>

        {regMessage && (
          <p className={`register-message ${regMessage.includes('sukces') ? 'success' : 'error'}`}>
            {regMessage}
          </p>
        )}

        <p className="register-footer">
          Masz już konto? <Link to="/">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
