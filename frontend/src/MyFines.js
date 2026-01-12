import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './MyFines.css';

function MyFines({ setIsLoggedIn }) {
  const [kary, setKary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchKary = async () => {
      const idKlienta = localStorage.getItem('idKlienta');
      if (!idKlienta) {
        setErrorMessage('Nie znaleziono danych klienta. Zaloguj się ponownie.');
        setLoading(false);
        return;
      }

      try {
        // endpoint pasujący do KaraServiceView
        const res = await axios.get(`http://localhost:8080/api/kary/klient/${idKlienta}`);

        // Zapewnienie domyślnych wartości
        const karyData = Array.isArray(res.data)
          ? res.data.map(k => ({
              ...k,
              dniSpoznienia: k.dniSpoznienia || 0,
              kwotaCalkowita: k.kwotaCalkowita || 0,
              oplacone: k.oplacone || false,
              tytul: k.tytul || '-',
            }))
          : [];

        setKary(karyData);
      } catch (error) {
        console.error(error);
        setErrorMessage('Błąd podczas pobierania kar.');
      } finally {
        setLoading(false);
      }
    };

    fetchKary();
  }, []); // uruchamia się przy pierwszym renderze komponentu

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL');
  };

  if (loading) return <p>Ładowanie kar...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div className="fines-panel">
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      <h2>Twoje kary</h2>

      <table className="fines-table">
        <thead>
          <tr>
            <th>Film</th>
            <th>Termin zwrotu</th>
            <th>Dni spóźnienia</th>
            <th>Kwota</th>
            <th>Opłacone</th>
          </tr>
        </thead>
        <tbody>
          {kary.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-message">Brak kar</td>
            </tr>
          ) : (
            kary.map((k, index) => (
              <tr key={index} className={k.oplacone ? 'paid' : 'unpaid'}>
                <td>{k.tytul}</td>
                <td>{formatDate(k.terminZwrotu)}</td>
                <td>{k.dniSpoznienia}</td>
                <td>{k.kwotaCalkowita.toFixed(2)} zł</td>
                <td>{k.oplacone ? 'Tak' : 'Nie'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyFines;
