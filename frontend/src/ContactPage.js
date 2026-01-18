import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './ContactPage.css';

function ContactPage({ setIsLoggedIn }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get('http://localhost:8082/api/filie');
        setBranches(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Błąd pobierania danych kontaktowych:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  return (
    <div className="contact-panel">
      <Navbar setIsLoggedIn={setIsLoggedIn} />

      <h2>📍 Nasze Filie</h2>
      <p className="contact-description">
        Znajdź najbliższą placówkę naszej wypożyczalni. Jesteśmy do Twojej dyspozycji w kilku miastach,
        oferując szeroki wybór filmów i profesjonalną obsługę.
      </p>

      <table className="contact-table">
        <thead>
          <tr>
            <th>Filia</th>
            <th>Adres</th>
            <th>Telefon</th>
            <th>E-mail</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.idFilii}>
              <td className="branch-name">{branch.nazwa}</td>
              <td>{branch.adres}</td>
              <td>{branch.telefon}</td>
              <td>{branch.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="contact-info-box">
        <h3>Godziny otwarcia</h3>
        <p>Poniedziałek - Piątek: 09:00 - 20:00</p>
        <p>Sobota: 10:00 - 18:00</p>
        <p>Niedziela: Zamknięte</p>
      </div>

      <p className="price-footer">
        * Wszystkie nasze filie oferują możliwość zwrotu filmów w "wrzutniach" czynnych 24/7.
      </p>
    </div>
  );
}

export default ContactPage;