import React, { useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import './UserPanel.css';

function AdminReturns({ setIsLoggedIn }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [foundCustomer, setFoundCustomer] = useState(null);
    const [activeRentals, setActiveRentals] = useState([]);
    const [notification, setNotification] = useState(null);
    const [showFineModal, setShowFineModal] = useState(false);
    const [currentFineData, setCurrentFineData] = useState(null);
    const [pendingRentalId, setPendingRentalId] = useState(null);

    const adminFiliaId = localStorage.getItem('idFilii');

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const searchCustomer = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/klient/search`, {
                params: { imie: firstName, nazwisko: lastName }
            });
            const customer = res.data;
            setFoundCustomer(customer);

            if (customer.idKlienta) {
                fetchActiveRentals(customer.idKlienta);
            }
            showNotification("✅ Znaleziono klienta!");
        } catch (err) {
            setFoundCustomer(null);
            setActiveRentals([]);
            showNotification("🔍 Nie znaleziono klienta.");
        }
    };

    const fetchActiveRentals = async (idKlienta) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/wypozyczenia/active/${idKlienta}`);
            setActiveRentals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFullReturn = async (idWypozyczenia) => {
        try {
            const fineRes = await axios.get(`http://localhost:8080/api/admin/wypozyczenia/${idWypozyczenia}/kara`);

            if (fineRes.data.kwota && fineRes.data.kwota > 0) {
                // Zapisujemy dane i otwieramy modal zamiast window.confirm
                setCurrentFineData(fineRes.data.kwota);
                setPendingRentalId(idWypozyczenia);
                setShowFineModal(true);
            } else {
                // Jeśli nie ma kary, od razu wykonujemy zwrot
                executeReturn(idWypozyczenia);
            }
        } catch (err) {
            showNotification('❌ Błąd podczas sprawdzania kary.');
        }
    };

    const executeReturn = async (idWyp) => {
        try {
            await axios.post(`http://localhost:8080/api/admin/wypozyczenia/return/${idWyp}`);
            showNotification('✅ Zamówienie zostało zwrócone!');
            setShowFineModal(false); // Zamknij modal jeśli był otwarty
            fetchActiveRentals(foundCustomer.idKlienta);
        } catch (err) {
            showNotification('❌ Błąd podczas procesowania zwrotu.');
        }
    };

    const renderRentals = () => {
        if (activeRentals.length === 0) {
            return <p style={{textAlign: 'center', marginTop: '30px', color: '#666'}}>Brak aktywnych wypożyczeń.</p>;
        }

        return (
            <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Aktywne zamówienia klienta:</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px'
                }}>
                    {activeRentals.map((rental) => {
                        // Sprawdzamy czy wypożyczenie było w tej samej filii co pracownik
                        const isMyBranch = String(rental.egzemplarze[0]?.filiaId) === String(adminFiliaId);
                        const isOverdue = new Date(rental.terminZwrotu) < new Date();

                        return (
                            <div key={rental.idWypozyczenia} className="film-card" style={{
                                background: 'white',
                                borderLeft: isOverdue ? '5px solid #e74c3c' : '5px solid #3498db',
                                animation: 'fadeInUpCard 0.5s forwards'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Zamówienie #{rental.idWypozyczenia}</span>
                                    <span className="status-badge" style={{ background: '#f0f3f4', color: '#2c3e50' }}>
                                        {rental.dataWypozyczenia}
                                    </span>
                                </div>

                                <div style={{ margin: '10px 0' }}>
                                    <p style={{ fontSize: '14px', marginBottom: '5px' }}><strong>Filmy w paczce:</strong></p>
                                    <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#555' }}>
                                        {rental.egzemplarze.map(e => (
                                            <li key={e.idEgzemplarza}>{e.filmTytul}</li>
                                        ))}
                                    </ul>
                                </div>

                                <p style={{ fontSize: '14px', color: isOverdue ? '#e74c3c' : '#2c3e50' }}>
                                    <strong>Termin zwrotu:</strong> {rental.terminZwrotu} {isOverdue && '⚠️'}
                                </p>
                                {isOverdue && (
                                    <p style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '13px' }}>
                                        Wymagana weryfikacja kary finansowej!
                                    </p>
                                )}
                                <div style={{ marginTop: '15px' }}>
                                    {isMyBranch ? (
                                        <button
                                            className="add-btn"
                                            style={{ backgroundColor: '#3498db', width: '100%' }}
                                            onClick={() => handleFullReturn(rental.idWypozyczenia)}
                                        >
                                            Zwróć wszystkie filmy 📥
                                        </button>
                                    ) : (
                                        <p style={{ fontSize: '12px', color: '#95a5a6', textAlign: 'center', fontStyle: 'italic' }}>
                                            Wypożyczone w innej filii
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="admin-panel">
            <AdminNavbar setIsLoggedIn={setIsLoggedIn} />
            {notification && <div className="notification">{notification}</div>}

            <h2>🔄 Zwroty Zamówień</h2>

            <div className="admin-card">
                <h3>Wyszukaj klienta</h3>
                <div className="admin-form">
                    <input type="text" placeholder="Imię" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <input type="text" placeholder="Nazwisko" value={lastName} onChange={e => setLastName(e.target.value)} />
                    <button onClick={searchCustomer} className="add-btn">Szukaj Klienta 🔍</button>
                </div>
            </div>

            {/* Modal Kary */}
            {showFineModal && (
                <div className="modal-overlay">
                    <div className="admin-card modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3 style={{ color: '#e74c3c' }}>⚠️ Naliczono karę</h3>
                        <p style={{ fontSize: '18px', margin: '20px 0' }}>
                            Termin zwrotu został przekroczony. <br/>
                            <strong>Kwota do pobrania: {currentFineData?.toFixed(2)} zł</strong>
                        </p>
                        <p style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '20px' }}>
                            Czy potwierdzasz otrzymanie wpłaty od klienta?
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                className="add-btn"
                                style={{ backgroundColor: '#2ecc71' }}
                                onClick={() => executeReturn(pendingRentalId)}
                            >
                                Potwierdzam wpłatę i zwrot
                            </button>
                            <button
                                className="add-btn"
                                style={{ backgroundColor: '#95a5a6' }}
                                onClick={() => setShowFineModal(false)}
                            >
                                Anuluj
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {foundCustomer && renderRentals()}
        </div>
    );
}

export default AdminReturns;