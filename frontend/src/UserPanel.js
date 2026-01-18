import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './UserPanel.css';

function UserPanel({ setIsLoggedIn }) {
  const [films, setFilms] = useState([]);
  const [topFilms, setTopFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 25;

  // ===== Filtry =====
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [directorFilter, setDirectorFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('DOSTEPNY');

  // ===== Pobranie filmów =====
  const fetchFilms = async () => {
    try {
      const res = await axios.get('http://localhost:8082/api/films');
      setFilms(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      showNotification('❌ Błąd pobierania filmów');
    }
  };

  // ===== Pobranie Top 3 =====
  const fetchTopFilms = async () => {
    try {
      const res = await axios.get('http://localhost:8082/api/films/popular');
      setTopFilms(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== useEffect =====
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchFilms(), fetchTopFilms()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // ===== Powiadomienia =====
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // ===== Dodanie do koszyka =====
  const addToCart = (egzemplarz, filmTytul) => {
    if (egzemplarz.status !== 'DOSTEPNY') {
      return showNotification(`Egzemplarz "${filmTytul}" jest niedostępny ❌`);
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.find(f => f.idEgzemplarza === egzemplarz.idEgzemplarza)) {
      return showNotification(`Egzemplarz filmu "${filmTytul}" już w koszyku ❌`);
    }

    const newCart = [...cart, { ...egzemplarz, filmTytul }];
    localStorage.setItem('cart', JSON.stringify(newCart));
    showNotification(`🎬 Film "${filmTytul}" dodany do koszyka (Filia: ${egzemplarz.filiaNazwa}) ✅`);
  };

  // ===== Dropdowny =====
  const branches = Array.from(new Set(films.flatMap(f => f.egzemplarze.map(e => e.filiaNazwa))));
  const statuses = Array.from(new Set(films.flatMap(f => f.egzemplarze.map(e => e.status))));

  // ===== Filtracja =====
  const filteredFilms = films.filter(film => {
    const matchesTitle = film.tytul.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter ? film.gatunek.toLowerCase().includes(genreFilter.toLowerCase()) : true;
    const matchesDirector = directorFilter ? film.rezyser.toLowerCase().includes(directorFilter.toLowerCase()) : true;
    const matchesYear = yearFilter ? String(film.rokWydania).includes(yearFilter) : true;

    // Filtrujemy tylko filmy, które mają egzemplarze w wybranej filii/statusie
    const matchesBranchAndStatus = film.egzemplarze.some(e =>
      (!branchFilter || e.filiaNazwa === branchFilter) &&
      (!statusFilter || e.status === statusFilter)
    );

    return matchesTitle && matchesGenre && matchesDirector && matchesYear && matchesBranchAndStatus;
  });

  // ===== Paginacja =====
  const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);
  const indexOfLastFilm = currentPage * filmsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
  const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const Pagination = () => (
    <div className="pagination">
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>◀ Poprzednia</button>
      <span> Strona {currentPage} z {totalPages} </span>
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Następna ▶</button>
    </div>
  );

  return (
    <div className="user-panel">
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      {notification && <div className="notification">{notification}</div>}

      {/* ===== Top 3 ===== */}
      <div className="top-films-section">
        <h2>🔥 Top 3 filmy z największej liczby wypożyczeń</h2>
        <p className="description">Najpopularniejsze filmy w naszej wypożyczalni - sprawdź, które filmy cieszą się największym zainteresowaniem!</p>

        <div className="top-films-container">
          {topFilms.map((film, index) => (
            <div key={film.idFilmu} className="top-film-card-wrapper">
              <div className="top-film-card">
                {/* Front */}
                <div className="top-film-card-front">
                  <span className="rank">#{index + 1}</span>
                  {film.plakat && <img src={film.plakat} alt={film.tytul} />}
                  <h3>{film.tytul}</h3>
                  <p><b>Gatunek:</b> {film.gatunek}</p>
                  <p><b>Rok:</b> {film.rokWydania}</p>
                  <p><b>Reżyser:</b> {film.rezyser}</p>
                </div>
                {/* Back */}
                <div className="top-film-card-back">
                  <h3>Opis filmu:</h3>
                  <p>{film.opis}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2>🎬 Lista filmów</h2>

      {/* ===== Filtry ===== */}
      <div className="filters-container">
        <input type="text" placeholder="Szukaj filmu..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
        <input type="text" placeholder="Gatunek" value={genreFilter} onChange={e => { setGenreFilter(e.target.value); setCurrentPage(1); }} />
        <input type="text" placeholder="Reżyser" value={directorFilter} onChange={e => { setDirectorFilter(e.target.value); setCurrentPage(1); }} />
        <input type="text" placeholder="Rok" value={yearFilter} onChange={e => { setYearFilter(e.target.value); setCurrentPage(1); }} />
        <select value={branchFilter} onChange={e => { setBranchFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">Wszystkie filie</option>
          {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="DOSTEPNY">DOSTEPNY</option>
          <option value="">Wszystkie statusy</option>
          {statuses
            .filter(status => status !== 'DOSTEPNY') // żeby nie powtarzać
            .map(status => <option key={status} value={status}>{status}</option>)
          }
        </select>
      </div>

      {/* ===== Paginacja nad filmami ===== */}
      {totalPages > 1 && <Pagination />}

      {/* ===== Lista filmów ===== */}
      <div className={`films-container ${loading ? 'loading' : 'loaded'}`}>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <div className="loader-text">Ładowanie filmów...</div>
          </div>
        ) : currentFilms.length === 0 ? (
          <p>Brak wyników dla podanych filtrów</p>
        ) : (
          currentFilms.map((film, index) => (
            <div key={film.idFilmu} className="film-card" style={{ animationDelay: `${index * 0.1}s` }}>
              {film.plakat && <img src={film.plakat} alt={film.tytul} />}
              <h3>{film.tytul}</h3>
              <p><b>Gatunek:</b> {film.gatunek}</p>
              <p><b>Rok:</b> {film.rokWydania}</p>
              <p><b>Reżyser:</b> {film.rezyser}</p>
              <p className="opis">{film.opis}</p>

              <h4>Egzemplarze:</h4>
              {(() => {
                // Filtrujemy egzemplarze po filii i statusie
                const filteredCopies = film.egzemplarze.filter(e =>
                  (!branchFilter || e.filiaNazwa === branchFilter) &&
                  (!statusFilter || e.status === statusFilter)
                );

                if (filteredCopies.length === 0) return <p>Brak egzemplarzy</p>;

                // Grupujemy po filii
                const grouped = {};
                filteredCopies.forEach(e => {
                  const key = e.filiaNazwa;
                  if (!grouped[key]) grouped[key] = [];
                  grouped[key].push(e);
                });

                return Object.entries(grouped).map(([filia, egzList]) => {
                  // Liczymy ile egzemplarzy w tej filii ma status DOSTEPNY
                  const availableCount = egzList.filter(e => e.status === 'DOSTEPNY').length;

                  return (
                    <div key={filia} style={{ marginBottom: '8px' }}>
                      <b>{filia}</b>: {egzList.length} egzemplarz(y)
                      {statusFilter === 'DOSTEPNY' && availableCount > 0 && (
                        <button
                          onClick={() => addToCart(egzList.find(e => e.status === 'DOSTEPNY'), film.tytul)}
                          style={{ marginLeft: '10px' }}
                        >
                          ➕ Dodaj jeden do koszyka
                        </button>
                      )}
                    </div>
                  );
                });
              })()}



            </div>
          ))
        )}
      </div>

      {/* ===== Paginacja pod filmami ===== */}
      {totalPages > 1 && <Pagination />}
    </div>
  );
}

export default UserPanel;
