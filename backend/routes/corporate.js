const express = require('express');
const { getDatabase } = require('../db');
const router = express.Router();
const { createPitch, getPitchesByOwner } = require('../models/Pitch');
const { ObjectId } = require('mongodb');

router.get('/profile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const db = getDatabase();

        const corporateProfile = await db.collection('corporate').findOne({ username });
        if (!corporateProfile) {
            return res.status(404).json({ success: false, message: 'Profil bulunamadı.' });
        }
        res.status(200).json({ success: true, data: corporateProfile });
    } catch (error) {
        console.error(`[Backend] Hata oluştu: ${error.message}`);
        res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

router.put('/profile/:username', async (req, res) => {
    const { username } = req.params;
    const { detailedAddress, taxFile, fields } = req.body;
    try {
        const db = getDatabase();
        const updateResult = await db.collection('corporate').updateOne(
            { username },
            {
                $set: { detailedAddress, taxFile, fields },
            }
        );
        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Profil bulunamadı.' });
        }
        res.status(200).json({ success: true, message: 'Profil başarıyla güncellendi.' });
    } catch (error) {
        console.error(`[Backend] Güncelleme sırasında hata: ${error.message}`);
        res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

router.post('/pitches', async (req, res) => {
    const { pitchNo, price, capacity, ownerUsername } = req.body;

    if (!ownerUsername) {
        return res.status(400).json({ success: false, message: 'ownerUsername eksik.' });
    }

    try {
        const db = getDatabase();
        const newPitch = {
            pitchNo,
            price,
            capacity,
            isActive: false,
            approved: false,
            ownerUsername,
            reservations: [],
        };

        const result = await db.collection('pitches').insertOne(newPitch);
        res.status(201).json({ success: true, message: 'Saha başarıyla eklendi.', data: result });
    } catch (error) {
        console.error('Saha eklenirken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
});


router.get('/pitches/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const db = getDatabase();
        const pitches = await db.collection('pitches').find({ ownerUsername: username }).toArray();

        if (!pitches || pitches.length === 0) {
            return res.status(404).json({ success: false, message: 'Hiç saha bulunamadı.' });
        }

        res.status(200).json({ success: true, data: pitches });
    } catch (error) {
        console.error('Sahalar alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Sahalar alınırken bir hata oluştu.' });
    }
});

module.exports = router;
