import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import AdminNavbar from './AdminNavbar';
import './AdminPanel.css';

function AdminPanel({ setIsLoggedIn }) {
    const [films, setFilms] = useState([]);
    const [filie, setFilie] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [selectedFilia, setSelectedFilia] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resFilms = await axios.get('http://localhost:8080/api/films');
                const resFilie = await axios.get('http://localhost:8080/api/filie');

                console.log("Dane filii z API:", resFilie.data);

                // Gwarantujemy, że ustawiamy tablicę, nawet jeśli API zwróciło coś dziwnego
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

    // Przygotowanie opcji dla wyszukiwarki filii
    const filiaOptions = filie.map(f => ({
        value: f.idFilii,
        label: f.nazwa
    }));

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!selectedFilm || !selectedFilia) {
            setMessage('❌ Proszę wybrać film i filię');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/admin/egzemplarze', {
                idFilmu: selectedFilm.value,
                idFilii: selectedFilia.value
            });
            setMessage('✅ Pomyślnie dodano nowy egzemplarz!');
            // Opcjonalnie: odśwież dane
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

                    <label style={{ marginTop: '15px', display: 'block' }}>Wyszukaj filię:</label>
                    <Select
                        options={filiaOptions}
                        value={selectedFilia}
                        onChange={setSelectedFilia}
                        placeholder="Wpisz nazwę filii..."
                        isSearchable
                        noOptionsMessage={() => "Nie znaleziono filii"}
                    />

                    <button type="submit" style={{ marginTop: '20px' }}>Dodaj do bazy</button>
                </form>
            </div>

            <div className="inventory-list">
                <h3>Zarządzaj egzemplarzami</h3>
                {films.map(film => (
                    <div key={film.idFilmu} className="admin-film-row">
                        <strong>{film.tytul}</strong>
                        <ul>
                            {film.egzemplarze.map(e => (
                                <li key={e.idEgzemplarza}>
                                    ID: {e.idEgzemplarza} | {e.filiaNazwa} | Status: {e.status}
                                    <button className="del-btn" onClick={() => deleteEgzemplarz(e.idEgzemplarza)}>Usuń</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPanel;