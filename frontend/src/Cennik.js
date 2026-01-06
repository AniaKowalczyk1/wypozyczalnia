import React from 'react';
import Navbar from './Navbar';
import './Cennik.css';

function Cennik({ setIsLoggedIn }) {
  return (
    <div className="price-panel">
      <Navbar setIsLoggedIn={setIsLoggedIn} />

      <h2>💰 Cennik wypożyczeń</h2>

      <p className="price-description">
        🎬 <b>Tylko u nas!</b>
        Niezależnie od tego, czy wypożyczasz nowości, czy klasyki -
        <b> płacisz zawsze tyle samo za film</b>.
        Im więcej filmów wypożyczysz, tym większą otrzymujesz zniżkę!
      </p>

      <table className="price-table">
        <thead>
          <tr>
            <th>Liczba filmów</th>
            <th>Cena za film</th>
            <th>Łączna cena</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 film</td>
            <td>10,00 zł</td>
            <td>10,00 zł</td>
          </tr>
          <tr>
            <td>2–3 filmy</td>
            <td>9,00 zł</td>
            <td>od 18,00 zł</td>
          </tr>
          <tr>
            <td>4–6 filmów</td>
            <td>8,00 zł</td>
            <td>od 32,00 zł</td>
          </tr>
          <tr>
            <td>7+ filmów</td>
            <td>7,00 zł</td>
            <td>od 49,00 zł</td>
          </tr>
        </tbody>
      </table>

      <div className="delivery-box">
        <h3>🚚 Dostawa</h3>
        <p>
          Odbiór osobisty w filii: <b>GRATIS</b>
        </p>
        <p>
          Dostawa kurierska do domu: <b>12,99 zł</b>
        </p>
      </div>

      <p className="price-footer">
        💡 Ceny dotyczą jednego okresu wypożyczenia (do 30 dni).
        Przekroczenie terminu zwrotu może wiązać się z dodatkowymi opłatami.
      </p>
    </div>
  );
}

export default Cennik;
