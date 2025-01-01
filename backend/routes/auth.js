const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { getDatabase } = require('../db');

router.post('/register', async (req, res) => {
    const {
        accountType,
        username,
        firstName,
        lastName,
        email,
        phone,
        password,
        companyName,
    } = req.body;
    try {
        const db = getDatabase();
        const existingUser = await db
            .collection(accountType === 'kurumsal' ? 'corporate' : 'users')
            .findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Kullanıcı adı zaten alınmış.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role: accountType === 'kurumsal' ? 'kurumsal' : 'bireysel',
            createdAt: new Date(),
        };
        if (accountType === 'kurumsal') {
            newUser.companyName = companyName;
            newUser.approved = false;
        }
        const collectionName = accountType === 'kurumsal' ? 'corporate' : 'users';
        await db.collection(collectionName).insertOne(newUser);
        res.status(201).json({ success: true, message: 'Kayıt başarılı!' });
    } catch (error) {
        console.error('Kayıt sırasında bir hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Kayıt sırasında bir hata oluştu.' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = getDatabase();
        const user = await db.collection('users').findOne({ username }) || 
                     await db.collection('corporate').findOne({ username });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Şifre yanlış.' });
        }

        res.status(200).json({ success: true, role: user.role });
    } catch (error) {
        console.error('Giriş sırasında bir hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Giriş sırasında bir hata oluştu.' });
    }
});

router.get('/profile', async (req, res) => {
    const { username } = req.headers;

    try {
        const db = getDatabase();
        const user = await db.collection('users').findOne({ username });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }
        const { password, ...userData } = user;

        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        console.error('Profil bilgileri alınırken bir hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
});

router.patch('/profile', async (req, res) => {
    const { username } = req.headers; 
    const { firstName, lastName, email, phone } = req.body; 

    try {
        const db = getDatabase();
        const result = await db.collection('users').updateOne(
            { username },
            { $set: { firstName, lastName, email, phone } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }

        res.status(200).json({ success: true, message: 'Profil başarıyla güncellendi.' });
    } catch (error) {
        console.error('Profil güncellenirken bir hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
});


module.exports = router;
