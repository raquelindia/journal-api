const { entries } = require('./seedData');
const { sequelize } = require('./db');

const { Entry } = require('./server/models/index');

const syncSeed = async () => {
    try {
        await sequelize.sync({ force: true });
        await Entry.bulkCreate(entries);

        console.log('db populated!');
    } catch (error){
        console.error(error);
    }
};

syncSeed();