const { getDatabase } = require('../db');

const isAdmin = async (req, res, next) => {
    try {
        const db = getDatabase();
        const username = req.headers.username; 
        if (!username) {
            return res.status(403).json({ success: false, message: 'Yetkisiz erişim. Kullanıcı adı eksik.' });
        }
        const user = await db.collection('users').findOne({ username });
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Yetkisiz erişim.' });
        }
        next(); 
    } catch (error) {
        console.error('Admin kontrolü sırasında hata:', error);
        res.status(500).json({ success: false, message: 'Yetkilendirme sırasında bir hata oluştu.' });
    }
};
module.exports = isAdmin;
