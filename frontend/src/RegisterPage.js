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
  const [regHasloConfirm, setRegHasloConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regMessage, setRegMessage] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    const nameRegex = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s'-]+$/;
    if (!nameRegex.test(imie)) return "Imię może zawierać tylko litery, spacje i myślniki";
    if (!nameRegex.test(nazwisko)) return "Nazwisko może zawierać tylko litery, spacje i myślniki";

    const loginRegex = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9_-]{4,}$/;
    if (!loginRegex.test(regLogin)) return "Login musi mieć co najmniej 4 znaki i może zawierać litery, cyfry, _ lub -";

    if (regHaslo.length < 6) return "Hasło musi mieć co najmniej 6 znaków";
    if (regHaslo !== regHasloConfirm) return "Hasła nie są takie same";

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return "Niepoprawny format email";

    const addressRegex = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s.,/-]{5,}$/;
    if (!addressRegex.test(adres)) return "Adres musi mieć co najmniej 5 znaków i może zawierać litery, cyfry, spacje, przecinki, kropki, myślniki i ukośniki";

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
      setRegLogin(''); setEmail(''); setRegHaslo(''); setRegHasloConfirm('');

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

          {/* ===== Hasło z ikoną ===== */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Hasło"
              value={regHaslo}
              onChange={e => setRegHaslo(e.target.value)}
              required
            />
            <div
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
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

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Powtórz hasło"
              value={regHasloConfirm}
              onChange={e => setRegHasloConfirm(e.target.value)}
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
