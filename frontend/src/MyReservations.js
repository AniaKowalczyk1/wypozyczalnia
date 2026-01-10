import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './MyRentals.css'; // ten sam co dla wypożyczeń

function MyReservations({ setIsLoggedIn }) {
  const [activeReservations, setActiveReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      const idKlienta = localStorage.getItem('idKlienta');

      if (!idKlienta) {
        setErrorMessage('Nie znaleziono danych klienta. Zaloguj się ponownie.');
        setLoading(false);
        return;
      }

      try {
        // aktywne = AKTYWNA
        const activeRes = await axios.get(`http://localhost:8080/api/rezerwacje/active/${idKlienta}`);
        // przeszłe = wszystkie inne statusy
        const pastRes = await axios.get(`http://localhost:8080/api/rezerwacje/past/${idKlienta}`);

        setActiveReservations(Array.isArray(activeRes.data) ? activeRes.data : []);
        setPastReservations(Array.isArray(pastRes.data) ? pastRes.data : []);
      } catch (error) {
        console.error(error);
        setErrorMessage('Błąd podczas pobierania rezerwacji.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (errorMessage) return <p>{errorMessage}</p>;

  const renderReservations = (reservations) => (
    <table className="rentals-table">
      <thead>
        <tr>
          <th>Data rezerwacji</th>
          <th>Termin odbioru</th>
          <th>Status</th>
          <th>Filia</th>
          <th>Egzemplarz</th>
        </tr>
      </thead>
      <tbody>
        {reservations.length === 0 ? (
          <tr>
            <td colSpan={5} className="empty-message">
              Brak rezerwacji
            </td>
          </tr>
        ) : (
          reservations.flatMap(reservation => {
            if (!reservation.egzemplarze || reservation.egzemplarze.length === 0) {
              return (
                <tr key={reservation.idRezerwacji}>
                  <td>{reservation.dataRezerwacji}</td>
                  <td>{reservation.terminOdbioru || '-'}</td>
                  <td>{reservation.status}</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              );
            }

            return reservation.egzemplarze.map((e, index) => (
              <tr key={`${reservation.idRezerwacji}-${index}`}>
                <td>{index === 0 ? reservation.dataRezerwacji : ''}</td>
                <td>{index === 0 ? reservation.terminOdbioru || '-' : ''}</td>
                <td>{index === 0 ? reservation.status : ''}</td>
                <td className="filia-column">{e.filiaNazwa || '-'}</td>
                <td className="egzemplarz-column">{e.filmTytul || '-'}</td>
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
      <h2>Aktywne rezerwacje</h2>
      {renderReservations(activeReservations)}

      <h2>Przeszłe rezerwacje</h2>
      {renderReservations(pastReservations)}
    </div>
  );
}

export default MyReservations;
