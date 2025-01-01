import React, { useState, useEffect } from 'react';
import '../styles/PitchDetailPage.css';

const PitchDetailPage = ({ pitchId, username  }) => {
    const [pitch, setPitch] = useState({});
    const [reservations, setReservations] = useState([]);
    const [reservationData, setReservationData] = useState({
        date: '',
        startTime: '',
        endTime: '',
    });

useEffect(() => {
    fetch(`http://localhost:5000/public/pitches/${pitchId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                console.log('[Frontend] Halı saha verisi:', data.data); 
                setPitch(data.data);
            } else {
                console.error('Halı saha detayları alınamadı:', data.message);
            }
        })
        .catch((error) => console.error('Halı saha detayları alınırken hata oluştu:', error));
}, [pitchId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservationData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleReservationSubmit = async (e) => {
        e.preventDefault();
    
        const startHour = parseInt(reservationData.startTime.split(':')[1], 10);
        const endHour = parseInt(reservationData.endTime.split(':')[1], 10);
    
        if (startHour !== 0 || endHour !== 0) {
            alert('Rezervasyon saatleri yalnızca saat başı yapılabilir (ör. 10:00 - 11:00).');
            return;
        }
        const isOverlapping = reservations.some(
            (res) =>
                res.date === reservationData.date &&
                ((reservationData.startTime >= res.startTime && reservationData.startTime < res.endTime) ||
                    (reservationData.endTime > res.startTime && reservationData.endTime <= res.endTime))
        );
    
        if (isOverlapping) {
            alert('Seçilen tarih ve saat dilimi zaten rezerve edilmiş.');
            return;
        }

        const reservationWithUser = {
            ...reservationData,
            username,
        };
    
    
        try {
            const response = await fetch(`http://localhost:5000/public/pitches/${pitchId}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationWithUser),
            });
    
            const data = await response.json();
    
            if (data.success) {
                alert('Rezervasyon başarıyla oluşturuldu!');
                setReservations((prevReservations) => [...prevReservations, reservationWithUser]);
                setReservationData({ date: '', startTime: '', endTime: '' });
            } else {
                alert(data.message || 'Rezervasyon yapılamadı.');
            }
        } catch (error) {
            console.error('Rezervasyon işlemi sırasında hata oluştu:', error);
        }
    };
    

    return (
        <div className="pitch-detail-container">
             {pitch && pitch.pitchNo ? (
        <>
            <div className="pitch-detail">
                <h1>{`Saha No: ${pitch.pitchNo}`}</h1>
                <p>{`Fiyat: ${pitch.price ? `${pitch.price} TL` : 'Bilinmiyor'}`}</p>
                <p>
    Kapasite: {Number(pitch.capacity) === 14
        ? 'Orta Boyut'
        : Number(pitch.capacity) === 16
        ? 'Büyük Boyut'
        : 'Bilinmiyor'}
</p>

            </div>
        </>
    ) : (
        <p>Yükleniyor...</p>
    )}

            <div className="reservation-status">
                <h3>Mevcut Rezervasyonlar</h3>
                {reservations.length > 0 ? (
                    reservations.map((reservation, index) => (
                        <p key={index}>
                            {reservation.date} - {reservation.startTime} - {reservation.endTime}
                        </p>
                    ))
                ) : (
                    <p>Henüz bu saha için rezervasyon yapılmamış.</p>
                )}
            </div>

            <div className="reservation-form">
                <h3>Rezervasyon Yap</h3>
                <form onSubmit={handleReservationSubmit}>
                    <input
                        type="date"
                        name="date"
                        value={reservationData.date}
                        onChange={handleChange}
                        required
                    />
                   <input
    type="time"
    name="startTime"
    value={reservationData.startTime}
    onChange={handleChange}
    step="3600"
    required
/>

    <label>Bitiş Saati</label>
    <input
    type="time"
    name="endTime"
    value={reservationData.endTime}
    onChange={handleChange}
    step="3600"
    required
/>

                    <button type="submit">Rezervasyon Yap</button>
                </form>
            </div>
        </div>
    );
};

export default PitchDetailPage;
