import React, { useState, useEffect } from 'react';
import '../styles/CorporateProfile.css';

const CorporateProfile = ({ username }) => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        detailedAddress: '',
        taxFile: '',
        fields: [],
    });

    useEffect(() => {    
        fetch(`http://localhost:5000/corporate/profile/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setProfile(data.data);
                    setFormData({
                        detailedAddress: data.data.detailedAddress || '',
                        taxFile: data.data.taxFile || '',
                        fields: data.data.fields || [],
                    });
                }
            })
            .catch((error) => console.error(`[Frontend] Profil bilgileri alınırken hata oluştu:`, error));
    }, [username]);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {    
        fetch(`http://localhost:5000/corporate/profile/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    alert('Profil başarıyla güncellendi.');
                    setIsEditing(false);
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error(`[Frontend] Profil güncellenirken hata oluştu:`, error));
    };
    

    if (!profile) {
        return <h1>Yükleniyor...</h1>;
    }

    return (
        <div className="corporate-profile-container">
            <h1 className="profile-title">Kurumsal Profil</h1>
            <div className="profile-info">
                <p><strong>Şirket Adı:</strong> {profile.companyName}</p>
                <p><strong>Kullanıcı Adı:</strong> {profile.username}</p>
                <p><strong>E-posta:</strong> {profile.email}</p>
                <p><strong>Onay Durumu:</strong> {profile.approved ? 'Onaylı' : 'Onaysız'}</p>
            </div>
    
            {isEditing ? (
                <div className="profile-edit-form">
                    <input
                        className="form-input"
                        type="text"
                        name="detailedAddress"
                        value={formData.detailedAddress}
                        placeholder="Detaylı Adres"
                        onChange={handleChange}
                    />
                    <input
                        className="form-input"
                        type="text"
                        name="taxFile"
                        value={formData.taxFile}
                        placeholder="Vergi Levhası (Opsiyonel)"
                        onChange={handleChange}
                    />
                    <textarea
                        className="form-textarea"
                        name="fields"
                        value={formData.fields.join(', ')}
                        placeholder="Halı Saha İsimleri (Virgülle Ayrılmış)"
                        onChange={(e) => setFormData({ ...formData, fields: e.target.value.split(', ') })}
                    />
                    <button className="form-button" onClick={handleSubmit}>Kaydet</button>
                </div>
            ) : (
                <button className="edit-button" onClick={() => setIsEditing(true)}>Bilgileri Düzenle</button>
            )}
        </div>
    );
    
    
};

export default CorporateProfile;
