const {sequelize} = require('./db');
const {Entry} = require('./models/Entry');
const {entries} = require('./seedData');

const seed = async () => {
    await sequelize.sync({force: true });
    await Entry.bulkCreate(entries);
}

module.exports = seed;