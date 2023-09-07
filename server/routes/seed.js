const { seedEntry } = require('./seedData.js');
const { sequelize } = require('./db');
const { Entry } = require('./models');

const seed = async () => {
    try {
        await sequelize.sync({ force: true });

        await Promise.all(entries.map((entry) => Entry.create(entry)));

        console.log('db populated!');
    } catch (error){
        console.error(error);
    }
};

seed();