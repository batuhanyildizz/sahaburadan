const { getDatabase } = require('../db');

const collectionName = 'reservations';

async function createReservation(reservation) {
    const db = getDatabase();
    return await db.collection(collectionName).insertOne(reservation);
}

async function getReservationsByPitchId(pitchId) {
    const db = getDatabase();
    return await db.collection(collectionName).find({ pitchId }).toArray();
}

async function getReservationsByUser(username) {
    const db = getDatabase();
    return await db.collection('reservations').find({ username }).toArray();
}
async function deleteOldReservations(currentDate, currentTime) {
    const db = getDatabase();
    return await db.collection(collectionName).deleteMany({
        $or: [
            { date: { $lt: currentDate } },
            {
                date: currentDate,
                endTime: { $lt: currentTime },
            },
        ],
    });
}

module.exports = {
    createReservation,
    getReservationsByPitchId,
    deleteOldReservations,
    getReservationsByUser,
};
