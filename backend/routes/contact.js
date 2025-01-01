const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db');

router.post('/submit', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Tüm gerekli alanları doldurun.' });
    }
    try {
        const db = getDatabase();
        const result = await db.collection('contact_requests').insertOne({
            name,
            email,
            phone,
            message,
            createdAt: new Date(),
        });
        res.status(201).json({ success: true, message: 'Mesaj başarıyla gönderildi!', requestId: result.insertedId });
    } catch (error) {
        console.error('İletişim isteği kaydedilirken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Mesaj gönderilirken bir hata oluştu.' });
    }
});

router.get('/requests', async (req, res) => {
    try {
        const db = getDatabase();
        const contactRequests = await db.collection('contact_requests').find({}).toArray();
        res.status(200).json({ success: true, data: contactRequests });
    } catch (error) {
        console.error('İletişim istekleri alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'İletişim istekleri alınamadı.' });
    }
});


module.exports = router;
