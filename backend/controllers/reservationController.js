const reservationModel = require('../models/reservations');
const pitchModel = require('../models/Pitch');

exports.createReservation = async (req, res) => {
    try {
        const { pitchId, userId, date, startTime, endTime, duration, price } = req.body;
        const existingReservations = await reservationModel.getReservationsByPitch(pitchId);
        const isTimeSlotTaken = existingReservations.some((reservation) => {
            return (
                reservation.date === date &&
                ((startTime >= reservation.startTime && startTime < reservation.endTime) ||
                    (endTime > reservation.startTime && endTime <= reservation.endTime))
            );
        });

        if (isTimeSlotTaken) {
            return res.status(400).json({ success: false, message: 'Seçilen saat aralığı dolu.' });
        }
        const newReservation = {
            pitchId,
            userId,
            date,
            startTime,
            endTime,
            price: duration === 2 ? price * 1.5 : price,
        };
        
        await reservationModel.createReservation(newReservation);
        await pitchModel.updatePitchApproval(pitchId, false);
        res.status(201).json({ success: true, message: 'Rezervasyon başarıyla oluşturuldu.' });
    } catch (error) {
        console.error('[Backend] Rezervasyon oluşturulurken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const { pitchId } = req.params;
        const reservations = await reservationModel.getReservationsByPitch(pitchId);
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        console.error('[Backend] Rezervasyonlar alınırken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
};

exports.deleteOldReservations = async () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;

    try {
        await reservationModel.deleteOldReservations(currentDate, currentTime);
        console.log('[Backend] Geçmiş rezervasyonlar başarıyla silindi.');
    } catch (error) {
        console.error('[Backend] Eski rezervasyonlar silinirken hata oluştu:', error);
    }
};
