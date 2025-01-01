import React, { useEffect, useState } from 'react';
import '../styles/ContactBox.css';

const ContactBox = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/contact/requests')
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setRequests(data.data);
                } else {
                    console.error('Hata:', data.message);
                }
            })
            .catch((error) => console.error('İletişim istekleri alınırken hata oluştu:', error));
    }, []);

    if (!requests.length) {
        return <h2>İletişim isteği bulunmamaktadır.</h2>;
    }

    return (
        <div className="contact-requests-container">
            <h1>İletişim Kutusu</h1>
            <div className="contact-requests-grid">
                {requests.map((request) => (
                    <div key={request._id} className="contact-card">
                        <h2>{request.name}</h2>
                        <p><strong>Email:</strong> {request.email}</p>
                        <p><strong>Telefon:</strong> {request.phone}</p>
                        <p><strong>Mesaj:</strong> {request.message}</p>
                        <p><em>{new Date(request.createdAt).toLocaleString()}</em></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactBox;
