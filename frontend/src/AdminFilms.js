import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

function AdminFilms({ setIsLoggedIn }) {
    const [films, setFilms] = useState([]);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [newFilm, setNewFilm] = useState({ tytul: '', gatunek: '', rokWydania: '', rezyser: '', opis: '', plakat: '' });

    useEffect(() => {
        fetchFilms();
    }, []);

    const fetchFilms = async () => {
        try {
            const res = await axios.get('http://localhost:8082/api/films');
            setFilms(res.data);
        } catch (err) {
            console.error("Błąd pobierania filmów");
        }
    };

    const filteredFilms = films
        .filter(f => f.tytul.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const countA = a.egzemplarze?.length || 0;
            const countB = b.egzemplarze?.length || 0;
            return countA - countB;
        });

    const handleDeleteFilm = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten tytuł?")) return;
        try {
            await axios.delete(`http://localhost:8082/api/admin/films/${id}`);
            setMessage('🗑️ Film usunięty.');
            fetchFilms();
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.message || 'Nie można usunąć filmu.'));
        }
    };

    const handleAddFilm = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8082/api/admin/films', newFilm);
            setMessage('✅ Dodano nowy film!');
            setNewFilm({ tytul: '', gatunek: '', rokWydania: '', rezyser: '', opis: '', plakat: '' });
            fetchFilms();
        } catch (err) {
            setMessage('❌ Błąd dodawania filmu.');
        }
    };

    return (
        <div className="admin-panel">
            <AdminNavbar setIsLoggedIn={setIsLoggedIn} />
            <h2>🎬 Zarządzanie Filmami</h2>
            {message && <p className="admin-msg">{message}</p>}

            <div className="admin-card">
                <h3>Dodaj nowy tytuł do bazy</h3>
                <form onSubmit={handleAddFilm} className="admin-form">
                    <div className="form-group">
                        <label>Tytuł filmu</label>
                        <input
                            type="text"
                            placeholder="Tytuł"
                            value={newFilm.tytul}
                            onChange={e => setNewFilm({...newFilm, tytul: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Link do plakatu (URL)</label>
                        <input
                            type="text"
                            placeholder="https://link-do-obrazka.jpg"
                            value={newFilm.plakat}
                            onChange={e => setNewFilm({...newFilm, plakat: e.target.value})}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Gatunek</label>
                            <input
                                type="text"
                                placeholder="Gatunek"
                                value={newFilm.gatunek}
                                onChange={e => setNewFilm({...newFilm, gatunek: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Rok wydania</label>
                            <input
                                type="number"
                                placeholder="Rok wydania"
                                value={newFilm.rokWydania}
                                onChange={e => setNewFilm({...newFilm, rokWydania: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Reżyser</label>
                        <input
                            type="text"
                            placeholder="Imię i nazwisko"
                            value={newFilm.rezyser}
                            onChange={e => setNewFilm({...newFilm, rezyser: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Opis filmu</label>
                        <textarea
                            placeholder="Krótki opis fabuły..."
                            value={newFilm.opis}
                            onChange={e => setNewFilm({...newFilm, opis: e.target.value})}
                            required
                        />
                    </div>

                    <button type="submit" className="add-btn">➕ Dodaj Film do Katalogu</button>
                </form>
            </div>

            <div className="inventory-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3>Lista filmów</h3>
                    <input
                        type="text"
                        placeholder="Szukaj filmu po tytule..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                {filteredFilms.length > 0 ? (
                    filteredFilms.map(f => (
                        <div key={f.idFilmu} className="admin-film-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span><strong>{f.tytul}</strong> ({f.rokWydania}) - Egzemplarzy: {f.egzemplarze?.length || 0}</span>
                            <button
                                className={`del-btn ${f.egzemplarze?.length > 0 ? 'disabled' : ''}`}
                                onClick={() => f.egzemplarze?.length === 0 && handleDeleteFilm(f.idFilmu)}
                                disabled={f.egzemplarze?.length > 0}
                                title={f.egzemplarze?.length > 0 ? "Usuń najpierw wszystkie egzemplarze tego filmu" : "Usuń film z bazy"}
                            >
                                {f.egzemplarze?.length > 0 ? 'Zablokowane' : 'Usuń'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#666' }}>Nie znaleziono filmu o takim tytule.</p>
                )}
            </div>
        </div>
    );
}

export default AdminFilms;