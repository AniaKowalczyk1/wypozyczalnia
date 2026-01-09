import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './UserPanel.css';

function UserPanel({ setIsLoggedIn }) {
  const [films, setFilms] = useState([]);
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
  const [statusFilter, setStatusFilter] = useState('');

  // ===== Pobranie filmów =====
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

  useEffect(() => {
    fetchFilms();
  }, []);

  // ===== Powiadomienia =====
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // ===== Dodanie egzemplarza do koszyka =====
  const addToCart = (egzemplarz, filmTytul) => {
    if (egzemplarz.status !== 'DOSTEPNY') {
      return showNotification(`Egzemplarz "${filmTytul}" jest niedostępny ❌`);
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.find(f => f.idEgzemplarza === egzemplarz.idEgzemplarza)) {
      return showNotification(`Egzemplarz filmu "${filmTytul}" już w koszyku ❌`);
    }

    const newCart = [
      ...cart,
      {
        ...egzemplarz,
        filmTytul
      }
    ];

    localStorage.setItem('cart', JSON.stringify(newCart));
    showNotification(`🎬 Film "${filmTytul}" dodany do koszyka (Filia: ${egzemplarz.filiaNazwa}) ✅`);
  };

  // ===== Lista unikalnych filii i statusów do dropdownów =====
  const branches = Array.from(
    new Set(films.flatMap(f => f.egzemplarze.map(e => e.filiaNazwa)))
  );
  const statuses = Array.from(
    new Set(films.flatMap(f => f.egzemplarze.map(e => e.status)))
  );

  // ===== Filtracja =====
  const filteredFilms = films.filter(film => {
    const matchesTitle = film.tytul.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter
      ? film.gatunek.toLowerCase().includes(genreFilter.toLowerCase())
      : true;
    const matchesDirector = directorFilter
      ? film.rezyser.toLowerCase().includes(directorFilter.toLowerCase())
      : true;
    const matchesYear = yearFilter
      ? String(film.rokWydania).includes(yearFilter)
      : true;

    // Film pojawia się tylko, jeśli ma przynajmniej jeden egzemplarz pasujący do filii i statusu
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

      <h2>🎬 Lista filmów</h2>

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
        <select value={branchFilter} onChange={e => { setBranchFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">Wszystkie filie</option>
          {branches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">Wszystkie statusy</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Paginacja nad filmami */}
      {totalPages > 1 && <Pagination />}

      {/* ===== Lista filmów z animacją ===== */}
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
            <div
              key={film.idFilmu}
              className="film-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3>{film.tytul}</h3>
              <p><b>Gatunek:</b> {film.gatunek}</p>
              <p><b>Rok:</b> {film.rokWydania}</p>
              <p><b>Reżyser:</b> {film.rezyser}</p>
              <p className="opis">{film.opis}</p>

              <h4>Egzemplarze:</h4>
              {film.egzemplarze
                .filter(e => (!branchFilter || e.filiaNazwa === branchFilter) &&
                             (!statusFilter || e.status === statusFilter))
                .map(e => (
                  <ul key={e.idEgzemplarza}>
                    <li>
                      {film.tytul} | Status: {e.status} | Filia: {e.filiaNazwa}
                      {e.status === 'DOSTEPNY' && (
                        <button onClick={() => addToCart(e, film.tytul)}>➕ Dodaj do koszyka</button>
                      )}
                    </li>
                  </ul>
                ))
              }
            </div>
          ))
        )}
      </div>


      {/* Paginacja pod filmami */}
      {totalPages > 1 && <Pagination />}
    </div>
  );
}

export default UserPanel;
