import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import AdminNavbar from './AdminNavbar';
import './AdminCopy.css';

function AdminCopy({ setIsLoggedIn }) {
    const [films, setFilms] = useState([]);
    const [filie, setFilie] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [selectedFilia, setSelectedFilia] = useState(null);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const adminFiliaId = localStorage.getItem('idFilii');
    const nazwaFilii = localStorage.getItem('nazwaFilii');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resFilms = await axios.get('http://localhost:8080/api/films');
                const resFilie = await axios.get('http://localhost:8080/api/filie');

                console.log("Dane filii z API:", resFilie.data);

                // Gwarantujemy, że ustawiamy tablicę
                if (resFilms.data && Array.isArray(resFilms.data)) {
                    setFilms(resFilms.data);
                } else {
                    setFilms([]);
                }

                if (resFilie.data && Array.isArray(resFilie.data)) {
                    setFilie(resFilie.data);
                } else {
                    // Jeśli resFilie.data nie jest tablicą (np. jest obiektem błędu), ustawiamy pustą listę
                    setFilie([]);
                    console.error("API nie zwróciło tablicy dla filii!");
                }

            } catch (err) {
                console.error("Błąd podczas pobierania danych:", err);
                setFilms([]);
                setFilie([]);
            }
        };
        fetchData();
    }, []);

    // Przygotowanie opcji dla wyszukiwarki filmów
    const filmOptions = films.map(f => ({
        value: f.idFilmu,
        label: `${f.tytul} (${f.rokWydania})`
    }));


    const handleAdd = async (e) => {
        e.preventDefault();
        if (!selectedFilm) {
            setMessage('❌ Proszę wybrać film');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/admin/egzemplarze', {
                idFilmu: selectedFilm.value,
                idFilii: adminFiliaId
            });
            setMessage('✅ Dodano egzemplarz do Twojej filii!');
            const res = await axios.get('http://localhost:8080/api/films');
            setFilms(res.data);
        } catch (err) {
            setMessage('❌ Błąd podczas dodawania');
        }
    };

    const deleteEgzemplarz = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten egzemplarz?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/admin/egzemplarze/${id}`);
            setMessage('🗑️ Usunięto egzemplarz');
            // Odśwież listę filmów po usunięciu
            const res = await axios.get('http://localhost:8080/api/films');
            setFilms(res.data);
        } catch (err) {
            setMessage('❌ Błąd podczas usuwania');
        }
    };

    const filteredFilms = films
        .filter(f => f.tytul.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const hasA = a.egzemplarze?.some(e => String(e.filiaId) === String(adminFiliaId));
            const hasB = b.egzemplarze?.some(e => String(e.filiaId) === String(adminFiliaId));

            return (hasB ? 1 : 0) - (hasA ? 1 : 0);
        });

    return (
        <div className="admin-panel">
            <AdminNavbar setIsLoggedIn={setIsLoggedIn} />
            <h2>🛠️ Zarządzanie Egzemplarzami</h2>
            {message && <p className="admin-msg">{message}</p>}

            <div className="admin-card">
                <h3>Dodaj nowy egzemplarz</h3>
                <form onSubmit={handleAdd}>

                    <label>Wyszukaj film:</label>
                    <Select
                        options={filmOptions}
                        value={selectedFilm}
                        onChange={setSelectedFilm}
                        placeholder="Wpisz tytuł filmu..."
                        isSearchable
                        noOptionsMessage={() => "Nie znaleziono filmu"}
                    />

                    <button type="submit" style={{ marginTop: '20px' }}>Dodaj do bazy</button>
                </form>
            </div>

            <div className="inventory-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3>Aktualny inwentarz</h3>
                    <input
                        type="text"
                        placeholder="Szukaj egzemplarzy po tytule filmu..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '8px', width: '280px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                {filteredFilms.length > 0 ? (
                    filteredFilms.map(film => (
                        <div key={film.idFilmu} className="admin-film-row">
                            <strong>{film.tytul}</strong>
                            <ul>
                                {film.egzemplarze && film.egzemplarze
                                    .slice() // tworzymy kopię, by nie mutować oryginalnego stanu
                                    .sort((a, b) => {
                                        const aMine = String(a.filiaId) === String(adminFiliaId) && a.status === 'DOSTEPNY';
                                        const bMine = String(b.filiaId) === String(adminFiliaId) && b.status === 'DOSTEPNY';

                                        // Te, które "Można usunąć" (Moje + Dostępne), idą na górę
                                        return (bMine ? 1 : 0) - (aMine ? 1 : 0);
                                    })
                                    .map(e => {
                                        const belongsToMyBranch = String(e.filiaId) === String(adminFiliaId);
                                        const isDeletable = e.status === 'DOSTEPNY' && belongsToMyBranch;

                                        return (
                                            <li key={e.idEgzemplarza} style={{
                                                borderLeft: belongsToMyBranch ? '4px solid #4facfe' : 'none',
                                                backgroundColor: isDeletable ? '#f0f9ff' : 'transparent'
                                            }}>
                                                <div className="egzemplarz-info">
                                                    <span>ID: {e.idEgzemplarza}</span> |
                                                    <span> {e.filiaNazwa}</span> |
                                                    <span className={`status-badge ${e.status}`}>{e.status}</span>
                                                </div>

                                                {belongsToMyBranch ? (
                                                    <button
                                                        className={`del-btn ${!isDeletable ? 'disabled' : ''}`}
                                                        onClick={() => isDeletable && deleteEgzemplarz(e.idEgzemplarza)}
                                                        disabled={!isDeletable}
                                                    >
                                                        {isDeletable ? 'Usuń' : 'Zablokowane'}
                                                    </button>
                                                ) : (
                                                    <span style={{color: '#999', fontSize: '12px'}}>Inna filia</span>
                                                )}
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                        Nie znaleziono egzemplarzy dla wpisanego tytułu.
                    </p>
                )}
            </div>
        </div>
    );
}

export default AdminCopy;