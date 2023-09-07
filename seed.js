const seedData = require('./seedData');
const { sequelize } = require('./db');
const { Entry } = require('./models/index');



const syncSeed = async () => {
    try {
       //const entries = await .findAll();
        //await sequelize.sync({ force: true });
        await Entry.bulkCreate(seedData)

        console.log('db populated!');
    } catch (error){
        console.error(error);
    }
};

syncSeed();