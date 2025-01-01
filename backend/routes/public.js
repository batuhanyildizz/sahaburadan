const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db');
const { ObjectId } = require('mongodb');
const { getReservationsByUser  } = require('../models/reservations');


router.get('/pitches', async (req, res) => {
    try {
        const db = getDatabase();
        const pitches = await db.collection('pitches').find({}).toArray();
        res.status(200).json({ success: true, data: pitches });
    } catch (error) {
        console.error('Sahalar alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

router.get('/public/pitches', async (req, res) => {
    try {
        const db = getDatabase();
        const pitches = await db.collection('pitches').find({}).toArray();

        pitches.forEach((pitch) => console.log('[Backend] Kapasite:', pitch.capacity));

        res.status(200).json({ success: true, data: pitches });
    } catch (error) {
        console.error('[Backend] Halı sahalar alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
});

router.get('/public/pitches/:pitchId', async (req, res) => {
    const { pitchId } = req.params;

    try {
        const db = getDatabase();
        const pitch = await db.collection('pitches').findOne({ _id: new ObjectId(pitchId) });

        if (!pitch) {
            return res.status(404).json({ success: false, message: 'Halı saha bulunamadı.' });
        }

        res.status(200).json({ success: true, data: pitch });
    } catch (error) {
        console.error('[Backend] Halı saha bilgileri alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
});


router.get('/pitches/:id', async (req, res) => {
    const pitchId = req.params.id;
    const db = getDatabase();

    try {
        const pitch = await db.collection('pitches').findOne({ _id: new ObjectId(pitchId) });

        if (!pitch) {
            return res.status(404).json({ success: false, message: 'Halısaha bulunamadı.' });
        }

        res.json({ success: true, data: pitch });
    } catch (error) {
        console.error('[Backend] Hata:', error.message);
        res.status(500).json({ success: false, message: 'Halısaha bilgisi alınırken hata oluştu.' });
    }
});

router.get('/public/pitches/:pitchId/reservations', async (req, res) => {
    const { pitchId } = req.params;

    try {
        const db = getDatabase();
        const reservations = await db.collection('reservations').find({ pitchId }).toArray();

        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        console.error('[Backend] Rezervasyon verileri alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Rezervasyon verileri alınamadı.' });
    }
});


router.post('/pitches/:pitchId/reservations', async (req, res) => {
    const { pitchId } = req.params;
    const { date, startTime, endTime, username } = req.body;

    if (!date || !startTime || !endTime) {
        return res.status(400).json({
            success: false,
            message: 'Rezervasyon için tarih, başlangıç saati ve bitiş saati gereklidir.',
        });
    }

    try {
        const db = getDatabase();
        const reservation = {
            pitchId,
            date,
            startTime,
            endTime,
            createdAt: new Date(),
            username,
        };

        const existingReservation = await db.collection('reservations').findOne({
            pitchId,
            date,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
            ],
        });

        if (existingReservation) {
            return res.status(400).json({
                success: false,
                message: 'Bu saat aralığı için rezervasyon zaten yapılmış.',
            });
        }

        const result = await db.collection('reservations').insertOne(reservation);
        if (result.acknowledged) {
            res.status(201).json({
                success: true,
                data: { ...reservation, _id: result.insertedId },
                message: 'Rezervasyon başarıyla oluşturuldu.',
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Rezervasyon eklenemedi.',
            });
        }
    } catch (error) {
        console.error('[Backend] Rezervasyon eklenirken hata oluştu:', error);
        res.status(500).json({
            success: false,
            message: 'Rezervasyon eklenirken bir hata oluştu.',
        });
    }
});

router.get('/public/pitches/:pitchId', async (req, res) => {
    const { pitchId } = req.params;

    try {
        const db = getDatabase();
        const pitch = await db.collection('pitches').findOne({ _id: new ObjectId(pitchId) });

        if (!pitch) {
            return res.status(404).json({ success: false, message: 'Halı saha bulunamadı.' });
        }

        console.log('[Backend] Kapasite:', pitch.capacity);

        res.status(200).json({ success: true, data: pitch });
    } catch (error) {
        console.error('[Backend] Halı saha bilgileri alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
});

router.get('/user/:username/reservations', async (req, res) => {
    const { username } = req.params;

    try {
        const reservations = await getReservationsByUser(username);
        res.json({ success: true, data: reservations });
    } catch (error) {
        console.error('[Backend] Rezervasyonlar alınırken hata oluştu:', error.message);
        res.status(500).json({ success: false, message: 'Rezervasyonlar alınamadı.' });
    }
});


module.exports = router;
