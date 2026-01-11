import React, { useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

function AdminReturns({ setIsLoggedIn }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [foundCustomer, setFoundCustomer] = useState(null);
    const [activeRentals, setActiveRentals] = useState([]);
    const [message, setMessage] = useState('');
    const [notification, setNotification] = useState(null);

    const adminFiliaId = localStorage.getItem('idFilii');
    const searchCustomer = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/klient/search`, {
                params: { imie: firstName, nazwisko: lastName }
            });

            const customer = res.data;
            setFoundCustomer(customer);

            // KLUCZ: Używamy idKlienta, bo tak szuka WypozyczenieRepository
            if (customer.idKlienta) {
                const rentalsRes = await axios.get(`http://localhost:8080/api/wypozyczenia/active/${customer.idKlienta}`);
                setActiveRentals(rentalsRes.data);
            }
            setMessage('');
        } catch (err) {
            setFoundCustomer(null);
            setActiveRentals([]);
            setMessage('❌ Nie znaleziono klienta lub błąd pobierania danych.');
        }
    };

    const fetchActiveRentals = async (idKonta) => {
        try {
            // Zakładamy, że w foundCustomer masz idKlienta
            const res = await axios.get(`http://localhost:8080/api/wypozyczenia/active/${foundCustomer?.idKlienta || idKonta}`);
            setActiveRentals(res.data);
        } catch (err) {
            console.error(err);
        }
    };


    const handleSingleReturn = async (idWyp, idEgz) => {
        const adminFiliaId = localStorage.getItem('idFilii');
        try {
            await axios.post(`http://localhost:8080/api/admin/wypozyczenia/return-item`, null, {
                params: {
                    idWypozyczenia: idWyp,
                    idEgzemplarza: idEgz,
                    idFiliiPracownika: adminFiliaId
                }
            });
            showNotification("✅ Film został pomyślnie zwrócony."); // Zamiast setMessage
            fetchActiveRentals(foundCustomer.idKlienta);
        } catch (err) {
            showNotification("❌ Błąd podczas zwrotu filmu."); // Zamiast setMessage
        }
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const renderItems = () => {
        const adminFiliaId = localStorage.getItem('idFilii');

        const allBorrowedItems = activeRentals.flatMap(rental =>
            rental.egzemplarze
                .filter(e => e.status !== 'DOSTEPNY')
                .map(egzemplarz => ({
                    ...egzemplarz,
                    idWypozyczenia: rental.idWypozyczenia,
                    terminZwrotu: rental.terminZwrotu
                }))
        );

        if (allBorrowedItems.length === 0) {
            return <p style={{textAlign: 'center', marginTop: '30px', color: '#666'}}>Brak aktywnych wypożyczeń dla tego klienta.</p>;
        }

        return (
            <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Filmy do zwrotu:</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    {allBorrowedItems.map((item) => {
                        const isMyBranch = String(item.filiaId) === String(adminFiliaId);
                        const isOverdue = new Date(item.terminZwrotu) < new Date();

                        return (
                            <div key={item.idEgzemplarza} style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                borderLeft: isOverdue ? '5px solid #e74c3c' : '5px solid #2ecc71',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                opacity: isMyBranch ? 1 : 0.7
                            }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>ID: #{item.idEgzemplarza}</span>
                                        <span style={{
                                            fontSize: '11px',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            background: isMyBranch ? '#eafaf1' : '#f0f3f4',
                                            color: isMyBranch ? '#27ae60' : '#7f8c8d'
                                        }}>
                                        {item.filiaNazwa}
                                    </span>
                                    </div>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '18px' }}>{item.filmTytul}</h4>
                                    <p style={{ fontSize: '14px', margin: '5px 0', color: isOverdue ? '#e74c3c' : '#2c3e50' }}>
                                        <strong>Termin:</strong> {item.terminZwrotu} {isOverdue && '⚠️'}
                                    </p>
                                </div>

                                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                                    {isMyBranch ? (
                                        <button
                                            className="add-btn"
                                            style={{
                                                backgroundColor: '#2ecc71',
                                                width: '100%',
                                                padding: '10px',
                                                fontSize: '14px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleSingleReturn(item.idWypozyczenia, item.idEgzemplarza)}
                                        >
                                            Przyjmij zwrot 📥
                                        </button>
                                    ) : (
                                        <div style={{ fontSize: '12px', color: '#95a5a6', fontStyle: 'italic', padding: '10px' }}>
                                            Zwrot tylko w: {item.filiaNazwa}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Pomocnicza funkcja do koloru daty
    const styleDate = (dateStr) => {
        return new Date(dateStr) < new Date() ? '#e74c3c' : 'inherit';
    };

    return (
        <div className="admin-panel">
            <AdminNavbar setIsLoggedIn={setIsLoggedIn} />
            {/* TO DODAJEMY: Powiadomienie pojawiające się na górze */}
            {notification && <div className="notification">{notification}</div>}

            <h2>🔄 Zarządzanie Zwrotami</h2>

            <div className="admin-card">
                <h3>Wyszukaj klienta</h3>
                <div className="admin-form">
                    <input type="text" placeholder="Imię" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <input type="text" placeholder="Nazwisko" value={lastName} onChange={e => setLastName(e.target.value)} />
                    <button onClick={searchCustomer} className="add-btn">Szukaj Klienta 🔍</button>
                </div>
            </div>

            {foundCustomer && renderItems()}
        </div>
    );

}

export default AdminReturns;