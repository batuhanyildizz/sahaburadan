import React, { useState, useEffect } from 'react';
import '../styles/UserReservationsPage.css';

const UserReservationsPage = ({ username }) => {
    const [reservations, setReservations] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/public/user/${username}/reservations`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setReservations(data.data);
                } else {
                    console.error('Rezervasyonlar alınamadı:', data.message);
                }
            })
            .catch((error) => console.error('Rezervasyon verileri alınırken hata oluştu:', error));
    }, [username]);
    

    return (
        <div className="user-reservations-container">
            <h1>Rezervasyonlarım</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {reservations.length > 0 ? (
                <div className="reservations-list">
                    {reservations.map((reservation, index) => (
                        <div key={index} className="reservation-card">
                            <p><strong>Tarih:</strong> {reservation.date}</p>
                            <p><strong>Başlangıç Saati:</strong> {reservation.startTime}</p>
                            <p><strong>Bitiş Saati:</strong> {reservation.endTime}</p>
                            <p><strong>Halı Saha:</strong> {reservation.pitchNo}</p>
                            <p><strong>Durum:</strong> {reservation.isActive ? 'Aktif' : 'Tamamlandı'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Henüz bir rezervasyon yapmadınız.</p>
            )}
        </div>
    );
};

export default UserReservationsPage;
