const { getDatabase } = require('../db');

const collectionName = 'pitches';


async function createPitch(pitch) {
    const db = getDatabase();
    
    pitch.capacity = parseInt(pitch.capacity, 10);

    return await db.collection(collectionName).insertOne(pitch);
}


async function getAllPitches() {
    const db = getDatabase();
    return await db.collection(collectionName).find({}).toArray();
}

async function getPitchesByOwner(username) {
    const db = getDatabase();
    return await db.collection(collectionName).find({ ownerUsername: username }).toArray();
}

async function getPitchById(pitchId) {
    const db = getDatabase();
    return await db.collection('pitches').findOne({ _id: new ObjectId(pitchId) });
}

async function updatePitchApproval(pitchId, approvedStatus) {
    const db = getDatabase();
    return await db.collection(collectionName).updateOne(
        { _id: pitchId },
        { $set: { approved: approvedStatus } }
    );
}

async function updateCapacityField() {
    const db = getDatabase();
    try {
        const result = await db.collection(collectionName).updateMany(
            {}, 
            [{ $set: { capacity: { $toInt: "$capacity" } } }]
        );
        console.log(`[Backend] ${result.modifiedCount} doküman güncellendi.`);
    } catch (error) {
        console.error('[Backend] Kapasite alanı güncellenirken hata oluştu:', error);
    }
}


module.exports = {
    updateCapacityField,
    getPitchById,
    createPitch,
    getAllPitches,
    getPitchesByOwner,
    updatePitchApproval,
};
