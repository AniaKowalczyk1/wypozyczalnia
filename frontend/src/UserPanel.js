import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserPanel({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Panel użytkownika</h2>
      <p>Witaj! Twoja rola: <strong>{role}</strong></p>
      <button onClick={handleLogout} style={{ padding: '10px', marginTop: '20px' }}>Wyloguj</button>
    </div>
  );
}

export default UserPanel;
