const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Hashlenmiş Şifre:', hashedPassword);
    } catch (error) {
        console.error('Şifre hashlenirken hata oluştu:', error);
    }
};
const password = 'admin123'; 
hashPassword(password);
