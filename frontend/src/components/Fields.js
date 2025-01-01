import React, { useState, useEffect } from 'react';
import '../styles/Fields.css';

const Fields = ({ username }) => {
    const [pitches, setPitches] = useState([]);
    const [formData, setFormData] = useState({
        pitchNo: '',
        price: '',
        capacity: '',
    });

    const fetchPitches = async () => {
        try {
            const response = await fetch(`http://localhost:5000/corporate/pitches/${username}`);
            const data = await response.json();
    
            if (data.success) {
                setPitches(data.data);
            } else {
                console.error('Sahalar alınamadı:', data.message);
            }
        } catch (error) {
            console.error('Saha verileri alınırken hata oluştu:', error);
        }
    };
    
    useEffect(() => {
        fetchPitches();
 // eslint-disable-next-line
    }, [username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    const newPitch = {
        ...formData,
        isActive: false,
        ownerUsername: username, 
    };

    try {
        const response = await fetch('http://localhost:5000/corporate/pitches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPitch),
        });
        const data = await response.json();

        if (response.ok) {
            alert('Saha başarıyla eklendi!');
            fetchPitches();
        } else {
            alert(data.message || 'Saha eklenirken bir hata oluştu.');
        }
    } catch (error) {
        console.error('Saha eklenirken hata oluştu:', error);
    }
};


    return (
        <div className="fields-container">
            <h1>Sahalarım</h1>
            <button onClick={() => document.querySelector('.add-field-card').style.display = 'block'}>
                Saha Ekle
            </button>
            <div className="add-field-card">
                <h2>Yeni Saha Ekle</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="pitchNo"
                        placeholder="Saha Numarası"
                        value={formData.pitchNo}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Fiyat"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Kapasite Seçin</option>
                        <option value="14">Orta (14)</option>
                        <option value="16">Büyük (16)</option>
                    </select>
                    <button type="submit">Ekle</button>
                </form>
            </div>
            <div className="fields-list">
                {pitches.map((pitch) => (
                    <div key={pitch._id} className="field-card">
                        <p><strong>Saha No:</strong> {pitch.pitchNo}</p>
                        <p><strong>Fiyat:</strong> {pitch.price} TL</p>
                        <p>Kapasite: {Number(pitch.capacity) === 14 ? 'Orta Boyut' : 'Büyük Boyut'} ({pitch.capacity})</p>
                        <p><strong>Durum:</strong> {pitch.isActive ? 'Rezerve' : 'Uygun'}</p>
                        <p><strong>Onay:</strong> {pitch.approved ? 'Onaylı' : 'Onaysız'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Fields;
