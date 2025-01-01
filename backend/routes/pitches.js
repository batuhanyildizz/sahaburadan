const express = require('express');
const { getDatabase } = require('../db');
const router = express.Router();

router.post('/add-pitch', async (req, res) => {
    try {
        const { corporateOwner, pitchNo, price, capacity } = req.body;

        if (!corporateOwner || !pitchNo || !price || !capacity) {
            return res.status(400).json({ success: false, message: 'Tüm alanlar doldurulmalıdır.' });
        }

        const pitch = await db.collection('pitches').insertOne({
            corporateOwner,
            pitchNo,
            price,
            capacity,
            approved: false,
            createdAt: new Date(),
        });
        res.status(200).json({ success: true, message: 'Saha başarıyla eklendi.' });
    } catch (error) {
        console.error(`[SERVER LOG] Saha ekleme sırasında hata oluştu: ${error.message}`);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
});

router.get('/:pitchId/reservations', async (req, res) => {
    const { pitchId } = req.params;

    try {
        const reservations = await getReservationsByPitchId(pitchId);
        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ success: false, message: 'Rezervasyon bulunamadı.' });
        }
        res.json({ success: true, data: reservations });
    } catch (error) {
        console.error(`[Backend] Rezervasyon verileri alınırken hata oluştu: ${error.message}`);
        res.status(500).json({ success: false, message: 'Rezervasyonları alırken hata oluştu.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const db = getDatabase();
        const pitches = await db.collection('pitches').find().toArray();

        res.status(200).json({ success: true, data: pitches });
    } catch (error) {
        console.error('Sahalar alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
});

router.get('/pitches', async (req, res) => {
    try {
        const db = getDatabase();
        const pitches = await db.collection('pitches').find({}).toArray();
        res.status(200).json({ success: true, data: pitches });
    } catch (error) {
        console.error('[Backend] Halı saha verileri alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Halı saha verileri alınamadı.' });
    }
});


module.exports = router;
