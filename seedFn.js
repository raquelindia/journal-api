const {sequelize} = require('./db');
const {Entry} = require('./models/Entry');
const { User } = require('./models/User');
const {entries} = require('./seedData');
const {users} = require('./seedData');

const seed = async () => {
   
    await sequelize.sync({force: true});
    await Promise.all(entries.map((entry) => Entry.create(entry)));
    await Promise.all(users.map((users) => User.create(users)));
};

module.exports = seed;