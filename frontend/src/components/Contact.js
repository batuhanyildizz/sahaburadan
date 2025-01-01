import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/contact/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert('Mesajınız başarıyla gönderildi!');
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        message: '',
                    });
                } else {
                    alert(data.message || 'Mesaj gönderilirken bir hata oluştu.');
                }
            })
            .catch((error) => {
                console.error('Mesaj gönderilirken bir hata oluştu:', error);
                alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
            });
    };

    return (
        <div className="contact-container">
            <div className="contact-info">
                <h2>Bizimle İletişime Geçin</h2>
                <p>Kalkınma Mahallesi Akif Saruhan Caddesi</p>
                <p>Ortahisar / Trabzon</p>
                <p>Email: bilgi@sahaburadan.com</p>
                <p>Facebook: /Sahaburadan</p>
                <p>Instagram: /Sahaburadan</p>
            </div>
            <div className="contact-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Ad Soyad"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="E-Posta"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="İrtibat numarası giriniz"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="message"
                            placeholder="Öğrenmek istediğiniz her şeyi sorabilirsiniz."
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="submit-button">Gönder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Contact;
