import React, { useState } from 'react';
import '../styles/Register.css'; 

const Register = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        accountType: 'bireysel', 
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        companyName: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Şifreler eşleşmiyor!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
                onNavigate('login');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Kayıt sırasında bir hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Kayıt Ol</h1>
                <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <select
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                     >
                        <option value="bireysel">Bireysel Hesap</option>
                        <option value="kurumsal">Kurumsal Hesap</option>
                    </select>
                </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Kullanıcı Adı"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Ad"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Soyad"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="E-posta"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Telefon Numarası"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Şifre"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Şifre (Tekrar)"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {formData.accountType === 'kurumsal' && (
                        <div className="form-group">
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Şirket Adı"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <button type="submit" className="submit-button">
                        Kaydol
                    </button>
                </form>
                <p>
                    Zaten bir hesabınız var mı?{' '}
                    <a onClick={() => onNavigate('login')}>Giriş Yap</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
