const {sequelize} = require('./db');
const {Entry} = require('./models/Entry');
const {entries} = require('./seedData');

const seed = async () => {
   
    await sequelize.sync({force: true});
    await Promise.all(entries.map((entry) => Entry.create(entry)));
    
};

module.exports = seed;