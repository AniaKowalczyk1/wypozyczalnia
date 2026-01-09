import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Cart.css';

function Cart({ setIsLoggedIn }) {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [notification, setNotification] = useState(null);
  const [idKonta, setIdKonta] = useState(localStorage.getItem('idKonta') || null);
  const [selectedFiliaId, setSelectedFiliaId] = useState(null);
  const [dostawa, setDostawa] = useState('filia'); // domyślnie filia
  const [adresDomu, setAdresDomu] = useState(localStorage.getItem('adres') || '');
  const [clientData, setClientData] = useState({
    imie: localStorage.getItem('imie') || '',
    nazwisko: localStorage.getItem('nazwisko') || '',
    adres: localStorage.getItem('adres') || '',
    email: localStorage.getItem('email') || ''
  });

  const [showBlikModal, setShowBlikModal] = useState(false);
  const [blikCode, setBlikCode] = useState('');

  // ===== Powiadomienia =====
  const showNotification = (msg) => setNotification(msg);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  // ===== Grupowanie filmów wg filii =====
  const groupedByFilia = cart.reduce((acc, item) => {
    if (!acc[item.filiaId]) acc[item.filiaId] = { filiaNazwa: item.filiaNazwa, items: [] };
    acc[item.filiaId].items.push(item);
    return acc;
  }, {});

  // ===== Obliczanie ceny =====
  const calculatePrice = (numFilms) => {
    if (numFilms === 1) return 10 * numFilms;
    if (numFilms >= 2 && numFilms <= 3) return 9 * numFilms;
    if (numFilms >= 4 && numFilms <= 6) return 8 * numFilms;
    return 7 * numFilms;
  };
  const deliveryFee = 12.99;

  // ===== Obsługa zmiany adresu =====
  const handleAdresChange = (e) => {
    const newAdres = e.target.value;
    setAdresDomu(newAdres);
    setClientData(prev => ({ ...prev, adres: newAdres }));
    localStorage.setItem('adres', newAdres);
  };

  // ===== Usuń film z koszyka =====
  const removeFromCart = (filiaId, idEgzemplarza) => {
    const newCart = cart.filter(item => !(item.filiaId === Number(filiaId) && item.idEgzemplarza === idEgzemplarza));
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    showNotification('❌ Film usunięty z koszyka');
  };

  // ===== Rezerwacja / Wypożyczenie w filii =====
  const reserveOrCheckout = async () => {
    if (!selectedFiliaId) return showNotification('❌ Wybierz filię');
    const filiaGroup = groupedByFilia[selectedFiliaId];

    // Jeśli dostawa do domu, od razu otwieramy modal BLIK
    if (dostawa === 'dom') {
      setShowBlikModal(true);
      return;
    }

    // ===== Rezerwacja w filii =====
    const toReserve = filiaGroup.items.filter(e => e.status !== 'ZAREZERWOWANY');
    if (toReserve.length === 0) {
      showNotification('❌ Wszystkie egzemplarze w tej filii są już zarezerwowane');
      return;
    }

    try {
      // nowy endpoint dla rezerwacji
      await axios.post('http://localhost:8080/api/rezerwacje', {
        idKonta,
        egzemplarzeId: toReserve.map(f => f.idEgzemplarza)
      });

      showNotification(`✅ Egzemplarze w filii "${filiaGroup.filiaNazwa}" zostały zarezerwowane`);

      // Usuwamy z koszyka te egzemplarze
      const newCart = cart.filter(f => f.filiaId !== Number(selectedFiliaId));
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));

      // Reset wyboru filii
      setSelectedFiliaId(null);
      setDostawa('filia');

    } catch (err) {
      console.error(err);
      showNotification('❌ Błąd przy rezerwacji egzemplarzy');
    }
  };


  // ===== Wypożyczenie po wpisaniu BLIK =====
  const confirmBlikAndWypozycz = async () => {
    if (!blikCode || blikCode.length !== 6) {
      return showNotification('❌ Wprowadź prawidłowy 6-cyfrowy kod BLIK');
    }

    const filiaGroup = groupedByFilia[selectedFiliaId];
    const terminZwrotu = new Date();
    terminZwrotu.setMonth(terminZwrotu.getMonth() + 1);

    try {
      await axios.post('http://localhost:8080/api/wypozyczenia', {
        idKonta,
        idFilii: Number(selectedFiliaId),
        terminZwrotu: terminZwrotu.toISOString().split('T')[0],
        egzemplarzeId: filiaGroup.items.map(f => f.idEgzemplarza),
        dostawa,
        adresDostawy: dostawa === 'dom' ? adresDomu : null,
        blikCode
      }, { withCredentials: true });

      showNotification(`✅ Wypożyczono filmy z filii: ${filiaGroup.filiaNazwa}`);

      // Usuwamy filię z koszyka
      const newCart = cart.filter(f => f.filiaId !== Number(selectedFiliaId));
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));

      setSelectedFiliaId(null);
      setDostawa('filia');
      setShowBlikModal(false);
      setBlikCode('');

    } catch (err) {
      console.error(err);
      showNotification('❌ Błąd przy wypożyczeniu / niepoprawny kod BLIK');
    }
  };

  return (
    <div className="cart-panel">
      <Navbar setIsLoggedIn={setIsLoggedIn} />

      {notification && <div className="notification">{notification}</div>}

      <h2>🛒 Twój koszyk</h2>

      {Object.keys(groupedByFilia).length === 0 ? (
        <p>Koszyk jest pusty</p>
      ) : (
        Object.entries(groupedByFilia).map(([filiaId, filia]) => {
          const allReserved = filia.items.every(item => item.status === 'ZAREZERWOWANY');
          return (
            <div key={filiaId} className="cart-filia">
              <label className="filia-header">
                <input
                  type="checkbox"
                  checked={selectedFiliaId === filiaId}
                  onChange={() => setSelectedFiliaId(selectedFiliaId === filiaId ? null : filiaId)}
                />
                <strong>{filia.filiaNazwa}</strong>
              </label>

              <ul className="cart-list">
                {filia.items.map(item => (
                  <li key={item.idEgzemplarza}>
                    {item.filmTytul} {item.status === 'ZAREZERWOWANY' && '🟡 Zarezerwowany'}
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(filiaId, item.idEgzemplarza)}
                    >
                      ❌ Usuń
                    </button>
                  </li>
                ))}
              </ul>

              <p className="filia-price">
                💰 Łączna cena: <strong>{(calculatePrice(filia.items.length) + (dostawa === 'dom' ? deliveryFee : 0)).toFixed(2)} zł</strong>
              </p>

              {selectedFiliaId === filiaId && (
                <>
                  <div className="delivery-options">
                    <label>
                      <input
                        type="radio"
                        name="dostawa"
                        value="filia"
                        checked={dostawa === 'filia'}
                        onChange={() => setDostawa('filia')}
                      />
                      Odbiór w filii
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="dostawa"
                        value="dom"
                        checked={dostawa === 'dom'}
                        onChange={() => setDostawa('dom')}
                      />
                      Dostawa do domu (+{deliveryFee} zł)
                    </label>
                  </div>

                  {dostawa === 'dom' && (
                    <div className="client-data-panel">
                      <h3>📋 Dane klienta:</h3>
                      <p><strong>Imię:</strong> {clientData.imie || 'Brak danych'}</p>
                      <p><strong>Nazwisko:</strong> {clientData.nazwisko || 'Brak danych'}</p>
                      <p>
                        <strong>Adres:</strong>
                        <input type="text" value={adresDomu} onChange={handleAdresChange} />
                      </p>
                      <p><strong>Email:</strong> {clientData.email || 'Brak danych'}</p>
                      <button className="checkout-btn" onClick={reserveOrCheckout}>
                        🎬 Wypożycz
                      </button>
                    </div>
                  )}

                  {dostawa === 'filia' && !allReserved && (
                    <button
                      className="checkout-btn"
                      onClick={reserveOrCheckout}
                      style={{ backgroundColor: '#ffcc00' }}
                    >
                      🟡 Zarezerwuj w filii
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })
      )}

      {/* ===== Modal BLIK ===== */}
      {showBlikModal && (
        <div className="blik-modal">
          <div className="blik-modal-content">
            <h3>💳 Podaj kod BLIK</h3>
            <input
              type="text"
              value={blikCode}
              onChange={(e) => setBlikCode(e.target.value)}
              placeholder="6-cyfrowy kod BLIK"
              maxLength={6}
            />
            <div className="blik-modal-buttons">
              <button onClick={confirmBlikAndWypozycz}>Potwierdź</button>
              <button onClick={() => setShowBlikModal(false)}>Anuluj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
