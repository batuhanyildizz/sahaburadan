import React, { useEffect, useState } from 'react';
import ContactBox from './ContactBox';
import '../styles/AdminPanel.css';
import '../styles/Contact.css';

const AdminPanel = ({ username }) => {
    const [users, setUsers] = useState([]); // Bireysel üyeler
    const [corporates, setCorporates] = useState([]); // Kurumsal üyeler
    const [contactRequests, setContactRequests] = useState([]); // İletişim kutusu
    // eslint-disable-next-line no-unused-vars
    const [errorMessage, setErrorMessage] = useState('');
    const [pitches, setPitches] = useState([]); // Sahalar

    // Sahalar
    useEffect(() => {
        fetch('http://localhost:5000/admin/pitches')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setPitches(data.data);
                } else {
                    console.error('[Frontend] Pitch verisi alınamadı:', data.message);
                }
            })
            .catch((error) => console.error('[Frontend] Pitch verisi alınırken hata oluştu:', error));
    }, []);
    
    
    const approvePitch = async (id) => {
        const response = await fetch(`http://localhost:5000/admin/pitches/${id}/approve`, {
            method: 'PATCH',
        });
        if (response.ok) {
            alert('Saha onaylandı!');
            setPitches((prev) => prev.map((pitch) =>
                pitch._id === id ? { ...pitch, approved: true } : pitch
            ));
        }
    };
    

    // Bireysel üyeleri yükleme
    useEffect(() => {
        fetch('http://localhost:5000/admin/users', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', username },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUsers(data.data);
                } else {
                    setErrorMessage(data.message || 'Bireysel üyeler alınamadı.');
                }
            })
            .catch((error) => setErrorMessage(error.message));
    }, [username]);

    // Kurumsal üyeleri yükleme
    useEffect(() => {
        fetch('http://localhost:5000/admin/corporates', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', username },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setCorporates(data.data);
                } else {
                    setErrorMessage(data.message || 'Kurumsal üyeler alınamadı.');
                }
            })
            .catch((error) => setErrorMessage(error.message));
    }, [username]);

    // İletişim isteklerini yükleme
    useEffect(() => {
        fetch('http://localhost:5000/contact/requests')
            .then((response) => response.json())
            .then((data) => setContactRequests(data.data || []))
            .catch((error) => setErrorMessage(error.message));
    }, []);

    const approveCorporate = (id) => {
        fetch(`http://localhost:5000/admin/corporates/${id}/approve`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', username },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(data.message);
                    setCorporates((prev) =>
                        prev.map((corporate) =>
                            corporate._id === id ? { ...corporate, approved: true } : corporate
                        )
                    );
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => alert('Kurumsal üye onaylanamadı.'));
    };

    return (
        <div className="admin-panel">
            {/* Kullanıcılar Bölümü */}
            <div className="users-section">
                <h2>Kullanıcılar</h2>
                <div className="users-grid">
                    {/* Bireysel Üyeler */}
                    <div className="individual-users">
                        <h3>Bireysel Üyeler</h3>
                        <ul>
                            {users.map((user) => (
                                <li key={user._id}>
                                    <strong>{user.username}</strong> - {user.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Kurumsal Üyeler */}
                    <div className="corporate-users">
                        <h3>Kurumsal Üyeler</h3>
                        <ul>
                            {corporates.map((corporate) => (
                                <li key={corporate._id}>
                                    <strong>{corporate.companyName}</strong> - {corporate.email}
                                    {corporate.approved ? (
                                        <span className="approved">Onaylı</span>
                                    ) : (
                                        <button
                                            className="approve-btn"
                                            onClick={() => approveCorporate(corporate._id)}
                                        >
                                            Onayla
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
    
            {/* İletişim Kutusu */}
            <div className="contact-section">
                <ContactBox contactRequests={contactRequests} />
            </div>
    
            {/* Sahalar Bölümü */}
            <div className="pitches-section">
                <h2>Sahalar</h2>
                <div className="pitches-grid">
                    {pitches.map((pitch) => (
                        <div key={pitch._id} className="pitch-card">
                            <h3>Saha No: {pitch.pitchNo}</h3>
                            <p>Fiyat: {pitch.price} TL</p>
                            <p>
                                Kapasite:{' '}
                                {Number(pitch.capacity) === 14
                                    ? 'Orta Boyut'
                                    : 'Büyük Boyut'}{' '}
                                ({pitch.capacity})
                            </p>
                            <p>
                                <strong>Kurumsal Sahip:</strong>{' '}
                                {pitch.ownerUsername ? pitch.ownerUsername : 'Bilinmiyor'}
                            </p>
                            <p>
                                Onay Durumu: {pitch.approved ? 'Onaylı' : 'Onay Bekliyor'}
                            </p>
                            {!pitch.approved && (
                                <button className="approve-btn" onClick={() => approvePitch(pitch._id)}>
                                    Onayla
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );    
};

export default AdminPanel;
