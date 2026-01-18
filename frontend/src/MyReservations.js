import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './MyReservations.css';

function MyReservations({ setIsLoggedIn }) {
  const [activeReservations, setActiveReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [notification, setNotification] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchReservations = async () => {
    const idKlienta = localStorage.getItem('idKlienta');
    if (!idKlienta) {
      showNotification('❌ Nie znaleziono danych klienta. Zaloguj się ponownie.');
      return;
    }

    try {
      const activeRes = await axios.get(`http://localhost:8080/api/rezerwacje/active/${idKlienta}`);
      const pastRes = await axios.get(`http://localhost:8080/api/rezerwacje/past/${idKlienta}`);
      setActiveReservations(Array.isArray(activeRes.data) ? activeRes.data : []);
      setPastReservations(Array.isArray(pastRes.data) ? Array.isArray(pastRes.data) ? pastRes.data : [] : []);
    } catch (error) {
      showNotification('❌ Błąd podczas pobierania rezerwacji');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (idRezerwacji) => {
    try {
      const res = await axios.post(`http://localhost:8080/api/rezerwacje/odwolaj/${idRezerwacji}`);
      if (res.data === true) {
        showNotification('✅ Rezerwacja została odwołana');
        fetchReservations();
      } else {
        showNotification('❌ Nie można odwołać tej rezerwacji');
      }
    } catch (error) {
      showNotification('❌ Błąd podczas odwoływania rezerwacji');
    }
  };

  // ===== Czas do odwołania (północ dnia następnego po utworzeniu rezerwacji) =====
  const timeLeftToCancel = (dataRezerwacji) => {
    if (!dataRezerwacji) return null;

    const createdDate = new Date(dataRezerwacji);
    const cancelDeadline = new Date(createdDate);
    cancelDeadline.setDate(createdDate.getDate() + 1); // następny dzień
    cancelDeadline.setHours(23, 59, 59, 999); // do północy

    const now = new Date();
    const diffMs = cancelDeadline - now;
    if (diffMs <= 0) return 0;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

    return { hours: diffHours, minutes: diffMinutes };
  };

  const renderReservations = (reservations, isPast = false) => (
    <table className="rentals-table">
      <thead>
        <tr>
          <th>Data rezerwacji</th>
          <th>Termin odbioru</th>
          <th>Status</th>
          <th>Filia</th>
          <th>Egzemplarz</th>
          {!isPast && <th>Akcje</th>}
        </tr>
      </thead>
      <tbody>
        {reservations.length === 0 ? (
          <tr>
            <td colSpan={isPast ? 5 : 6} className="empty-message">Brak rezerwacji</td>
          </tr>
        ) : (
          reservations.flatMap(reservation => {
            const items = reservation.egzemplarze || [{}];
            const rowSpan = items.length;
            const cancelTime = timeLeftToCancel(reservation.dataRezerwacji);

            return items.map((e, index) => (
              <tr
                key={`${reservation.idRezerwacji}-${index}`}
                className={`reservation-row
                  ${reservation.status === 'PRZETERMINOWANA' ? 'expired' : ''}
                  ${hoveredId === reservation.idRezerwacji ? 'hovered-group' : ''}`}
                onMouseEnter={() => setHoveredId(reservation.idRezerwacji)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {index === 0 && (
                  <>
                    <td rowSpan={rowSpan}>{reservation.dataRezerwacji}</td>
                    <td rowSpan={rowSpan}>{reservation.terminOdbioru || '-'}</td>
                    <td rowSpan={rowSpan} style={{
                      fontWeight: 'bold',
                      color: reservation.status === 'AKTYWNA' ? '#2ecc71' :
                             reservation.status === 'PRZETERMINOWANA' ? '#e74c3c' : '#95a5a6'
                    }}>
                      {reservation.status}
                    </td>
                  </>
                )}
                <td>{e.filiaNazwa || '-'}</td>
                <td>{e.filmTytul || '-'}</td>
                {index === 0 && !isPast && (
                  <td rowSpan={rowSpan}>
                    <button className="cancel-btn" onClick={() => handleCancel(reservation.idRezerwacji)}
                      disabled={cancelTime === 0}>
                      Odwołaj
                    </button>
                    {cancelTime && cancelTime.hours >= 0 ? (
                      <div style={{ fontSize: '0.8em', marginTop: '4px', color: '#555' }}>
                        Pozostało {cancelTime.hours}h {cancelTime.minutes}m na odwołanie
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8em', marginTop: '4px', color: '#e74c3c' }}>
                        Czas na odwołanie minął
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ));
          })
        )}
      </tbody>
    </table>
  );

  return (
    <div className="rentals-panel">
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      {notification && <div className="notification">{notification}</div>}

      <h2>Aktywne rezerwacje</h2>
      {renderReservations(activeReservations, false)}

      <h2 style={{ marginTop: '40px' }}>Przeszłe rezerwacje</h2>
      {renderReservations(pastReservations, true)}
    </div>
  );
}

export default MyReservations;
