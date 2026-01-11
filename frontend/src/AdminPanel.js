import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import './UserPanel.css'; // Importujemy te same style co użytkownik

function AdminPanel({ setIsLoggedIn }) {
    const adminFiliaId = localStorage.getItem('idFilii');
    const nazwaFilii = localStorage.getItem('nazwaFilii');
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [selectedEgzemplarz, setSelectedEgzemplarz] = useState(null);
    const [adminCart, setAdminCart] = useState([]);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [customerLogin, setCustomerLogin] = useState('');
    const [foundCustomer, setFoundCustomer] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // Paginacja
    const [currentPage, setCurrentPage] = useState(1);
    const filmsPerPage = 25;

    // Filtry
    const [searchQuery, setSearchQuery] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const [directorFilter, setDirectorFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/films');
                setFilms(res.data);
            } catch (err) {
                console.error(err);
                showNotification('❌ Błąd pobierania filmów');
            } finally {
                setLoading(false);
            }
        };
        fetchFilms();
    }, []);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // Filtrowanie filmów pod kątem filii pracownika
    const filteredFilms = films.filter(film => {
        // Sprawdzamy, czy film ma jakikolwiek egzemplarz w filii pracownika
        const hasEgzemplarzInAdminFilia = film.egzemplarze.some(e =>
            String(e.filiaId) === String(adminFiliaId)
        );

        if (!hasEgzemplarzInAdminFilia) return false;

        const matchesTitle = film.tytul.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = genreFilter ? film.gatunek.toLowerCase().includes(genreFilter.toLowerCase()) : true;
        const matchesDirector = directorFilter ? film.rezyser.toLowerCase().includes(directorFilter.toLowerCase()) : true;
        const matchesYear = yearFilter ? String(film.rokWydania).includes(yearFilter) : true;

        return matchesTitle && matchesGenre && matchesDirector && matchesYear;
    });

    // Paginacja
    const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);
    const indexOfLastFilm = currentPage * filmsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
    const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);

    const goToPage = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const addToAdminCart = (egzemplarz, filmTytul) => {
        if (adminCart.find(item => item.idEgzemplarza === egzemplarz.idEgzemplarza)) {
            return showNotification(`❌ Ten egzemplarz jest już wybrany.`);
        }
        setAdminCart([...adminCart, { ...egzemplarz, filmTytul }]);
        showNotification(`➕ Dodano: ${filmTytul}`);
    };

    const removeFromAdminCart = (idEgzemplarza) => {
        // Tworzymy nową listę bez elementu o danym ID
        setAdminCart(adminCart.filter(item => item.idEgzemplarza !== idEgzemplarza));
        showNotification("➖ Usunięto film z listy.");
    };

    const handleCheckCustomer = async () => {
        const searchImie = firstName.trim();
        const searchNazwisko = lastName.trim();

        if (!searchImie || !searchNazwisko) {
            showNotification("⚠️ Wpisz imię i nazwisko.");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8080/api/klient/search`, {
                params: { imie: searchImie, nazwisko: searchNazwisko }
            });
            setFoundCustomer(res.data);
            setShowAddForm(false); // Jeśli znaleziono, ukrywamy formularz rejestracji
            showNotification("✅ Znaleziono klienta!");
        } catch (err) {
            setFoundCustomer(null);
            if (err.response && err.response.status === 404) {
                setShowAddForm(true); // <--- TUTAJ: Włączamy formularz rejestracji
                showNotification("🔍 Nie znaleziono klienta. Możesz go teraz zarejestrować.");
            } else {
                showNotification("❌ Błąd połączenia z bazą.");
            }
        }
    };

    const handleQuickRegister = async () => {
        try {
            const res = await axios.post('http://localhost:8080/api/klient/quick-register', {
                imie: firstName,
                nazwisko: lastName,
                adres: address
            });
            setFoundCustomer(res.data);
            setShowAddForm(false);
            showNotification("✅ Nowy klient został zarejestrowany!");
        } catch (err) {
            showNotification("❌ Błąd rejestracji.");
        }
    };

    const finalizeRental = async () => {
        if (!foundCustomer || adminCart.length === 0) return;

        // Ustawiamy termin zwrotu (np. za 30 dni)
        const termin = new Date();
        termin.setDate(termin.getDate() + 30);
        const terminString = termin.toISOString().split('T')[0];

        try {
            await axios.post('http://localhost:8080/api/wypozyczenia', {
                idKonta: foundCustomer.idKonta,
                idFilii: parseInt(adminFiliaId),
                terminZwrotu: terminString,
                egzemplarzeId: adminCart.map(item => item.idEgzemplarza),
                dostawa: 'filia',
                adresDostawy: null
            });

            showNotification("🎉 Wypożyczenie zakończone sukcesem!");

            // Czyścimy wszystko po sukcesie
            setAdminCart([]);
            setIsFinalizing(false);
            setFoundCustomer(null);
            setCustomerLogin('');

            // Odświeżamy listę filmów, aby zaktualizować statusy egzemplarzy
            const res = await axios.get('http://localhost:8080/api/films');
            setFilms(res.data);

        } catch (err) {
            console.error(err);
            showNotification("❌ Błąd podczas finalizacji wypożyczenia.");
        }
    };

    const calculatePrice = (numFilms) => {
        if (numFilms === 1) return 10.0;
        if (numFilms >= 2 && numFilms <= 3) return 9.0 * numFilms;
        if (numFilms >= 4 && numFilms <= 6) return 8.0 * numFilms;
        return 7.0 * numFilms;
    };

    return (
        <div className="user-panel"> {/* Używamy tej samej klasy głównej */}
            <AdminNavbar setIsLoggedIn={setIsLoggedIn} />
            {notification && <div className="notification">{notification}</div>}

            <h2>🏪 Wypożyczalnia Stacjonarna</h2>

            {/* ===== Filtry ===== */}
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Szukaj filmu..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
                <input
                    type="text"
                    placeholder="Gatunek"
                    value={genreFilter}
                    onChange={e => { setGenreFilter(e.target.value); setCurrentPage(1); }}
                />
                <input
                    type="text"
                    placeholder="Reżyser"
                    value={directorFilter}
                    onChange={e => { setDirectorFilter(e.target.value); setCurrentPage(1); }}
                />
                <input
                    type="text"
                    placeholder="Rok"
                    value={yearFilter}
                    onChange={e => { setYearFilter(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {adminCart.length > 0 && !isFinalizing && (
                <div className="admin-card" style={{
                    position: 'sticky',
                    top: '80px',
                    zIndex: 100,
                    border: '2px solid #4facfe',
                    background: 'white',
                    padding: '15px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>🛒 Sesja wypożyczania ({adminCart.length})</h3>
                        <button
                            className="add-btn"
                            style={{ width: 'auto', padding: '10px 20px' }}
                            onClick={() => setIsFinalizing(true)}
                        >
                            Dalej: Dane klienta ➡️
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {adminCart.map(item => (
                            <span key={item.idEgzemplarza} className="status-badge DOSTEPNY" style={{
                                padding: '5px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                    {item.filmTytul} (ID: {item.idEgzemplarza})

                                {/* PRZYCISK USUWANIA (X) */}
                                <button
                                    onClick={() => removeFromAdminCart(item.idEgzemplarza)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#e74c3c',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        padding: '0 2px'
                                    }}
                                    title="Usuń z listy"
                                >
                        ✕
                    </button>
                </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Paginacja góra */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>◀ Poprzednia</button>
                    <span> Strona {currentPage} z {totalPages} </span>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Następna ▶</button>
                </div>
            )}

            <div className={`films-container ${loading ? 'loading' : 'loaded'}`}>
                {loading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <div className="loader-text">Ładowanie katalogu...</div>
                    </div>
                ) : (
                    currentFilms.map((film, index) => (
                        <div
                            key={film.idFilmu}
                            className="film-card"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <h3>{film.tytul}</h3>
                            <p><b>Gatunek:</b> {film.gatunek}</p>
                            <p><b>Rok:</b> {film.rokWydania}</p>
                            <p><b>Reżyser:</b> {film.rezyser}</p>
                            <p className="opis">{film.opis}</p>

                            <h4>Egzemplarze w Twojej filii:</h4>
                            {film.egzemplarze
                                .filter(e => String(e.filiaId) === String(adminFiliaId))
                                .map(e => (
                                    <ul key={e.idEgzemplarza} className="cart-list" style={{marginTop: '5px'}}>
                                        <li style={{fontSize: '13px', padding: '8px'}}>
                                            ID: {e.idEgzemplarza} | {e.filiaNazwa || 'Twoja Filia'} |
                                            <span className={`status-badge ${e.status}`}> {e.status}</span>

                                            {e.status === 'DOSTEPNY' && (
                                                <button
                                                    style={{width: 'auto', padding: '4px 8px', marginLeft: '10px'}}
                                                    onClick={() => addToAdminCart(e, film.tytul)}
                                                >
                                                    Wybierz
                                                </button>
                                            )}
                                        </li>
                                    </ul>
                                ))
                            }
                        </div>
                    ))
                )}
            </div>

            {isFinalizing && (
                <div className="blik-modal">
                    <div className="blik-modal-content" style={{ maxWidth: '500px' }}>
                        <h3>👤 Finalizacja wypożyczenia</h3>
                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <p><strong>Wybrane filmy:</strong></p>
                            <ul>
                                {adminCart.map(item => (
                                    <li key={item.idEgzemplarza} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span>{item.filmTytul} (ID: {item.idEgzemplarza})</span>
                                        <button
                                            onClick={() => removeFromAdminCart(item.idEgzemplarza)}
                                            style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                            Usuń
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <p>Łączna kwota: <strong>{calculatePrice(adminCart.length).toFixed(2)} zł</strong></p>
                        </div>

                        <hr />

                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                            <label>Dane klienta:</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
                                <input
                                    type="text"
                                    placeholder="Imię"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    style={{
                                        width: '100%',         // Pełna szerokość
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        boxSizing: 'border-box' // Gwarantuje, że padding nie zwiększy szerokości
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Nazwisko"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    style={{
                                        width: '100%',         // Pełna szerokość
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <button
                                    className="nav-btn"
                                    style={{
                                        height: '40px',
                                        width: '100%',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0'
                                    }}
                                    onClick={handleCheckCustomer}
                                >
                                    Szukaj klienta 🔍
                                </button>
                            </div>
                        </div>

                        {foundCustomer && (
                            <div className="client-data-panel" style={{ textAlign: 'left', background: '#eafaf1' }}>
                                <p>✅ <strong>{foundCustomer.imie} {foundCustomer.nazwisko}</strong></p>
                                <p>Adres: {foundCustomer.adres}</p>
                                <button className="checkout-btn" onClick={finalizeRental}>
                                    Potwierdź i Wypożycz
                                </button>
                            </div>
                        )}

                        {showAddForm && (
                            <div style={{ marginTop: '15px', padding: '15px', background: '#fdf2e9', borderRadius: '5px' }}>
                                <p style={{ color: '#e67e22', fontWeight: 'bold' }}>⚠️ Klienta nie ma w bazie. Dodaj adres, aby go zarejestrować:</p>
                                <input
                                    type="text"
                                    placeholder="Adres zamieszkania klienta..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    style={{ width: '100%', padding: '10px', marginTop: '10px', boxSizing: 'border-box' }}
                                />
                                <button
                                    className="add-btn"
                                    style={{ width: '100%', marginTop: '10px', backgroundColor: '#27ae60' }}
                                    onClick={handleQuickRegister}
                                >
                                    Zapisz i kontynuuj 💾
                                </button>
                            </div>
                        )}

                        <button
                            className="remove-btn"
                            style={{
                                height: '40px',
                                width: '100%',
                                backgroundColor: '#95a5a6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0', // Wyrównujemy do lewej krawędzi (brak marginesu)
                                marginTop: '10px' // Tylko odstęp od góry
                            }}
                            onClick={() => {
                                setIsFinalizing(false);
                                setFoundCustomer(null);
                            }}
                        >
                            ⬅️ Powrót do katalogu
                        </button>
                    </div>
                </div>
            )}

            {/* Paginacja dół */}
            {totalPages > 1 && (
                <div className="pagination" style={{marginTop: '30px'}}>
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>◀ Poprzednia</button>
                    <span> Strona {currentPage} z {totalPages} </span>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Następna ▶</button>
                </div>
            )}
        </div>


    );
}

export default AdminPanel;