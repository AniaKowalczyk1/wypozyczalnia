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

    // Pobranie unikalnych filii do dropdowna
    const branches = Array.from(new Set(films.flatMap(f => f.egzemplarze.map(e => e.filiaNazwa))));

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
                                                    onClick={() => setSelectedEgzemplarz(e)}
                                                >
                                                    Wybierz ➡️
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