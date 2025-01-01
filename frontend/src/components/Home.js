import React, { useState, useEffect } from 'react';
import '../styles/Home.css';

const Home = ({ isLoggedIn, onNavigate }) => {
    const [pitches, setPitches] = useState([]);

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        fetch('http://localhost:5000/public/pitches')
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setPitches(shuffleArray(data.data)); 
                } else {
                    console.error('Sahalar yüklenemedi:', data.message);
                }
            })
            .catch((error) => console.error('Hata:', error));
    }, []);

    const handlePitchClick = (pitchId) => {
        onNavigate(`pitchDetail-${pitchId}`);
    };

    return (
        <div className="home-container">
        {/* Hoşgeldiniz Bölümü */}
        <div className="welcome-section">
        <h1>Sahaburadan - Halısaha Rezervasyon Platformu</h1>
    {!isLoggedIn ? (
        <div className="home-buttons">
            <button onClick={() => onNavigate('register')}>Kayıt Ol</button>
            <button onClick={() => onNavigate('login')}>Giriş Yap</button>
        </div>
    ) : (
        <div className="tooltip-container">
            <p className="tooltip-text">Sahaburadan nedir?</p>
            <div className="tooltip-content">
                Sahaburadan, kullanıcılarımızın kolayca halısaha rezervasyonu yapmasını sağlayan modern bir platformdur.
                Güvenli ve hızlı bir şekilde halısahanızı rezerve edin!
            </div>
        </div>
    )}
        </div>
    
            {/* Divider */}
            <hr className="divider" />
    
            {/* Discover Section */}
            <div className="discover-section">
                <h2>Keşfet</h2>
                <div className="pitch-list">
                    {pitches.map((pitch) => (
                        <div
                            key={pitch._id}
                            className="pitch-card"
                            onClick={() => handlePitchClick(pitch._id)}
                        >
                            <h3>Saha No: {pitch.pitchNo}</h3>
                            <p>Fiyat: {pitch.price} TL</p>
                            <p> Kapasite: {pitch.capacity === 14
        ? 'Orta Boyut'
        : pitch.capacity === 16
        ? 'Büyük Boyut'
        : 'Bilinmiyor'}</p>
                        </div>
                    ))}
                </div>
            </div>
    
            {/* Footer */}
            <footer className="footer">
                © 2024 Sahaburadan. Tüm hakları saklıdır. <br />
                Bize ulaşın: <a href="mailto:info@sahaburadan.com">info@sahaburadan.com</a>
            </footer>
        </div>
    );
};

export default Home;