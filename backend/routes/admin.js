const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db');
const isAdmin = require('../middlewares/isAdmin'); 
const { ObjectId } = require('mongodb');
const { getAllPitches, updatePitchApproval } = require('../models/Pitch');


router.get('/users', isAdmin, async (req, res) => {
    try {
        const db = getDatabase();
        const users = await db.collection('users').find().toArray();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Bireysel üyeleri listeleme hatası:', error);
        res.status(500).json({ success: false, message: 'Bireysel üyeler alınamadı.' });
    }
});

router.get('/corporates', isAdmin, async (req, res) => {
    try {
        const db = getDatabase();
        const corporates = await db.collection('corporate').find().toArray();
        res.status(200).json({ success: true, data: corporates });
    } catch (error) {
        console.error('Kurumsal üyeleri listeleme hatası:', error);
        res.status(500).json({ success: false, message: 'Kurumsal üyeler alınamadı.' });
    }
});

router.get('/pitches', async (req, res) => {
    const db = getDatabase();

    try {        
        const pitches = await db.collection('pitches').aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'ownerUsername',
                    foreignField: 'username',
                    as: 'ownerInfo',
                },
            },
            {
                $unwind: {
                    path: '$ownerInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    pitchNo: 1,
                    price: 1,
                    capacity: 1,
                    isActive: 1,
                    approved: 1,
                    ownerUsername: 1,
                    'ownerInfo.name': 1,
                    'ownerInfo.email': 1,
                },
            },
        ]).toArray();
            
        res.status(200).json({ success: true, data: pitches });
    } catch (error) {
        console.error('[Backend] Sahalar alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Sahalar alınırken hata oluştu.', error: error.message });
    }
});



router.post('/pitches', async (req, res) => {
    const { pitchNo, price, capacity, ownerUsername } = req.body;

    if (!ownerUsername) {
        return res.status(400).json({ success: false, message: 'Saha sahibinin kullanıcı adı eksik.' });
    }

    try {
        const newPitch = await Pitch.create({
            pitchNo,
            price,
            capacity,
            ownerUsername,
            isActive: false,
            approved: false,
        });

        res.status(201).json({ success: true, data: newPitch });
    } catch (error) {
        console.error('Saha eklenirken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
});


router.patch('/corporates/:id/approve', isAdmin, async (req, res) => {
    const corporateId = req.params.id;

    try {
        const db = getDatabase();

        const objectId = new ObjectId(corporateId);

        const result = await db.collection('corporate').updateOne(
            { _id: objectId },
            { $set: { approved: true } }
        );
        if (result.matchedCount === 0) {
            console.log('Eşleşen kurumsal üye bulunamadı.');
            return res.status(404).json({ success: false, message: 'Kurumsal üye bulunamadı.' });
        }

        res.status(200).json({ success: true, message: 'Kurumsal üye onaylandı.' });
    } catch (error) {
        console.error('Kurumsal üye onaylama hatası:', error);
        res.status(500).json({ success: false, message: 'Kurumsal üye onaylanamadı.' });
    }
});

router.patch('/pitches/:id/approve', async (req, res) => {
    try {
        const pitchId = new ObjectId(req.params.id);
        const result = await updatePitchApproval(pitchId, true);

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Saha bulunamadı' });
        }

        res.status(200).json({ success: true, message: 'Saha başarıyla onaylandı' });
    } catch (error) {
        console.error('Saha onaylanırken hata oluştu:', error.message);
        res.status(500).json({ success: false, message: 'Bir hata oluştu' });
    }
});

module.exports = router;
