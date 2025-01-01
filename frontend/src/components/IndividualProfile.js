import React, { useEffect, useState } from 'react';

const IndividualProfile = ({ username }) => {
    const [profileData, setProfileData] = useState(null);
    const [editMode, setEditMode] = useState(false); 
    const [formData, setFormData] = useState({}); 
    const [reservations, setReservations] = useState([]); 

    useEffect(() => {
        fetch('http://localhost:5000/auth/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'username': username, // Header'dan username gönder
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setProfileData(data.data);
                    setFormData(data.data);
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error('Profil bilgileri alınamadı:', error));
    }, [username]);

    const handleSave = () => {
        fetch('http://localhost:5000/auth/profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'username': username,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(data.message);
                    setProfileData(formData);
                    setEditMode(false); 
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error('Profil güncellenemedi:', error));
    };

    return (
        <div>
            <h1>Bireysel Profil</h1>
            {profileData ? (
                <div>
                    {!editMode ? (
                        <div>
                            <p>Kullanıcı Adı: {profileData.username}</p>
                            <p>Ad: {profileData.firstName}</p>
                            <p>Soyad: {profileData.lastName}</p>
                            <p>E-posta: {profileData.email}</p>
                            <p>Telefon: {profileData.phone}</p>
                            <button onClick={() => setEditMode(true)}>Düzenle</button>
                        </div>
                    ) : (
                        <div>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <button onClick={handleSave}>Kaydet</button>
                            <button onClick={() => setEditMode(false)}>İptal</button>
                        </div>
                    )}

                    <h2>Rezervasyonlarım</h2>
                    {reservations.length > 0 ? (
                        <ul>
                            {reservations.map((reservation, index) => (
                                <li key={index}>{reservation}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Henüz rezervasyon yapılmadı.</p>
                    )}
                </div>
            ) : (
                <p>Yükleniyor...</p>
            )}
        </div>
    );
};

export default IndividualProfile;
