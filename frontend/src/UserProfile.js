import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './UserProfile.css';

function UserProfile({ setIsLoggedIn }) {
  const [profil, setProfil] = useState({
    imie: '',
    nazwisko: '',
    adres: '',
    login: '',
    email: '',
    haslo: '',
    hasloConfirm: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const idKlienta = localStorage.getItem('idKlienta');

  // ===== Pobranie profilu =====
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/profil/${idKlienta}`);
        const data = { ...response.data, haslo: '', hasloConfirm: '' };
        setProfil(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (idKlienta) fetchProfil();
  }, [idKlienta]);

  // ===== Obsługa zmian w formularzu =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfil(prev => ({ ...prev, [name]: value }));
  };

  // ===== Zapisanie zmian (walidacja dopiero przy submit) =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(profil).forEach(field => {
      const value = profil[field];
      let error = '';

      switch (field) {
        case 'imie':
        case 'nazwisko':
          if (!/^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s'-]+$/.test(value)) {
            error = field === 'imie'
              ? "Imię może zawierać tylko litery, spacje i myślniki"
              : "Nazwisko może zawierać tylko litery, spacje i myślniki";
          }
          break;
        case 'adres':
          if (!/^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s.,/-]{5,}$/.test(value)) {
            error = "Adres musi mieć co najmniej 5 znaków i może zawierać litery, cyfry, spacje, przecinki, kropki, myślniki i ukośniki";
          }
          break;
        case 'email':
          if (!/\S+@\S+\.\S+/.test(value)) {
            error = "Niepoprawny format email";
          }
          break;
        case 'haslo':
          if (value && value.length < 6) {
            error = "Hasło musi mieć co najmniej 6 znaków";
          }
          break;
        case 'hasloConfirm':
          if (profil.haslo && value !== profil.haslo) {
            error = "Hasła nie są takie same";
          }
          break;
        default:
          break;
      }

      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    // jeśli są błędy, przerwij zapis
    if (Object.keys(newErrors).length > 0) return;

    try {
      const payload = {
        imie: profil.imie,
        nazwisko: profil.nazwisko,
        adres: profil.adres,
        email: profil.email,
        haslo: profil.haslo || undefined
      };

      await axios.put(`http://localhost:8080/api/profil/${idKlienta}`, payload);

      const response = await axios.get(`http://localhost:8080/api/profil/${idKlienta}`);
      const data = { ...response.data, haslo: '', hasloConfirm: '' };
      setProfil(data);
      setErrors({ global: '✅ Dane zostały zaktualizowane!' });

      localStorage.setItem('imie', data.imie || '');
      localStorage.setItem('nazwisko', data.nazwisko || '');
      localStorage.setItem('adres', data.adres || '');
      localStorage.setItem('login', data.login || '');
      localStorage.setItem('email', data.email || '');
    } catch (err) {
      console.error(err);
      setErrors({ global: '❌ Błąd podczas aktualizacji danych' });
    }
  };

  return (
    <div className="profile-panel">
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      {errors.global && <div className="notification">{errors.global}</div>}

      <h2>👤 Twój profil</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        {['imie', 'nazwisko', 'adres', 'email'].map(field => (
          <div className="profile-field" key={field}>
            <label>{field === 'imie' ? 'Imię' :
                    field === 'nazwisko' ? 'Nazwisko' :
                    field === 'adres' ? 'Adres' :
                    'Email'}:</label>
            <input
              type="text"
              name={field}
              value={profil[field]}
              onChange={handleChange}
            />
            {errors[field] && <div className="field-error">{errors[field]}</div>}
          </div>
        ))}

        {/* Pola hasła z wrapperem i możliwością pokazania/ukrycia */}
        {['haslo', 'hasloConfirm'].map(field => (
          <div className="profile-field" key={field}>
            <label>{field === 'haslo' ? 'Nowe hasło' : 'Powtórz nowe hasło'}:</label>
            <div className="password-wrapper">
              <input
                type={
                  field === 'haslo'
                    ? showPassword ? 'text' : 'password'
                    : showPasswordConfirm ? 'text' : 'password'
                }
                name={field}
                value={profil[field]}
                onChange={handleChange}
                placeholder="Pozostaw puste jeśli nie zmieniasz"
              />
              <div
                className="password-toggle"
                onClick={() =>
                  field === 'haslo'
                    ? setShowPassword(!showPassword)
                    : setShowPasswordConfirm(!showPasswordConfirm)
                }
              >
                {field === 'haslo'
                  ? showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94a10 10 0 0 1-11.88 0M1 1l22 22"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )
                  : showPasswordConfirm ? (
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
            {errors[field] && <div className="field-error">{errors[field]}</div>}
          </div>
        ))}

        {/* Pole login */}
        <div className="profile-field">
          <label>Login:</label>
          <input type="text" value={profil.login} disabled />
        </div>

        <button type="submit" className="save-btn">
          💾 Zapisz zmiany
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
