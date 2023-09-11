const {sequelize} = require('./db');
const {Entry} = require('./models/Entry');
const { User } = require('./models/User');
const {SuperAdmin} = require('./models/SuperAdmin');
const {entries} = require('./seedData');
const {users} = require('./seedData');
const {superadmins} = require('./seedData');



const seed = async () => {
   
    await sequelize.sync({force: true});
    await Promise.all(entries.map((entry) => Entry.create(entry)));
    await Promise.all(users.map((users) => User.create(users)));
    await Promise.all(superadmins.map((superadmins) => SuperAdmin.create(superadmins)));
};

module.exports = seed;