import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './MyRentals.css';

function MyRentals({ setIsLoggedIn }) {
  const [activeRentals, setActiveRentals] = useState([]);
  const [pastRentals, setPastRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRentals = async () => {
      const idKlienta = localStorage.getItem('idKlienta');

      if (!idKlienta) {
        setErrorMessage('Nie znaleziono danych klienta. Zaloguj się ponownie.');
        setLoading(false);
        return;
      }

      try {
        const [activeRes, pastRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/wypozyczenia/active/${idKlienta}`),
          axios.get(`http://localhost:8080/api/wypozyczenia/past/${idKlienta}`)
        ]);

        setActiveRentals(Array.isArray(activeRes.data) ? activeRes.data : []);
        setPastRentals(Array.isArray(pastRes.data) ? pastRes.data : []);
      } catch (error) {
        console.error(error);
        setErrorMessage('Błąd podczas pobierania wypożyczeń.');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  if (errorMessage) return <p>{errorMessage}</p>;

  const renderRentals = (rentals, showReturnDate = false) => (
    <table className="rentals-table">
      <thead>
        <tr>
          <th>Data wypożyczenia</th>
          {showReturnDate && <th>Data zwrotu</th>}
          <th>Filia</th>
          <th>Egzemplarz</th>
        </tr>
      </thead>
      <tbody>
        {rentals.length === 0 ? (
          <tr>
            <td colSpan={showReturnDate ? 4 : 3} className="empty-message">
              Brak wypożyczeń
            </td>
          </tr>
        ) : (
          rentals.flatMap(rental => {
            if (!rental.egzemplarze || rental.egzemplarze.length === 0) {
              return (
                <tr key={rental.idWypozyczenia}>
                  <td>{rental.dataWypozyczenia}</td>
                  {showReturnDate && <td>{rental.dataZwrotu || '-'}</td>}
                  <td>-</td>
                  <td>-</td>
                </tr>
              );
            }

            return rental.egzemplarze.map((e, index) => (
              <tr key={`${rental.idWypozyczenia}-${index}`}>
                <td>{index === 0 ? rental.dataWypozyczenia : ''}</td>
                {showReturnDate && <td>{index === 0 ? rental.dataZwrotu || '-' : ''}</td>}
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
      <Navbar setIsLoggedIn={setIsLoggedIn} /> {/* <-- Navbar */}
      <h2>Aktywne wypożyczenia</h2>
      {renderRentals(activeRentals)}

      <h2>Przeszłe wypożyczenia</h2>
      {renderRentals(pastRentals, true)}
    </div>
  );
}

export default MyRentals;
