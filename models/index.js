const {Entry} = require('./Entry');
const {User} = require('./User');
const {SuperAdmin} = require('./SuperAdmin');
const {sequelize, Sequelize} = require('../db');

//Entry.belongsTo(User, {foreignKey: 'creatorId'});

User.hasMany(Entry);
Entry.hasOne(User);


module.exports = {
    SuperAdmin,
    Entry,
    User,
    sequelize,
    Sequelize
}