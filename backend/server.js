const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin'); 
const corporateRoutes = require('./routes/corporate'); 
const contactRoutes = require('./routes/contact');
const pitchRoutes = require('./routes/pitches');
const publicRoutes = require('./routes/public'); 
const reservationController = require('./controllers/reservationController');
const pitchesRoutes = require('./routes/pitches');

setInterval(() => {
    reservationController.deleteOldReservations();
}, 60 * 60 * 1000);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotalar
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/corporate', corporateRoutes);
app.use('/contact', contactRoutes);
app.use('/pitches', pitchRoutes);
app.use('/public', publicRoutes);
app.use('/reservations', require('./routes/reservationRoutes'));
app.use('/public/pitches', pitchesRoutes);


app.get('/', (req, res) => {
    res.send('Backend çalışıyor ve hazır!');
});

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Veritabanı bağlantısı başarısız:', error);
});
app.use((req, res) => {
    res.status(404).send('Endpoint bulunamadı.');
});
