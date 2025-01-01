import React, { useState } from 'react';
import '../styles/Login.css';
import futbolcuSag from '../styles/images/futbolcusag.png';
import futbolcuSol from '../styles/images/futbolcusol.png';

const Login = ({ onLoginSuccess, onNavigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Giriş başarılı!');
                onLoginSuccess(data.role, username);
            } else {
                alert(`Hata: ${data.message}`);
            }
        } catch (error) {
            console.error('Giriş sırasında bir hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    };

    return (
        <div className="login-container">
            <img src={futbolcuSol} alt="Futbolcu Sol" className="futbolcu-sol" />
            <div className="login-card">
                <h1>Giriş Yap</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Giriş Yap</button>
                </form>
                <p>
                    Hesabınız yok mu?{' '}
                    <a onClick={() => onNavigate('register')}>Kayıt Ol</a>
                </p>
            </div>
            <img src={futbolcuSag} alt="Futbolcu Sağ" className="futbolcu-sag" />
        </div>
    );
};

export default Login;
