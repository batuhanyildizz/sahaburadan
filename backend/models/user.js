const { getDatabase } = require('../db');

const collectionName = 'users';

async function createUser(user) {
    const db = getDatabase();
    return await db.collection(collectionName).insertOne(user);
}

async function findUserByEmail(email) {
    const db = getDatabase();
    return await db.collection(collectionName).findOne({ email });
}

module.exports = { createUser, findUserByEmail };
