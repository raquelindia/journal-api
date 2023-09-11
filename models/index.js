const {Entry} = require('./Entry');
const {User} = require('./User');
const {SuperAdmin} = require('./SuperAdmin');
const {sequelize, Sequelize} = require('../db');

Entry.belongsTo(User, {foreignKey: 'ownerId'});
User.hasMany(Entry);


module.exports = {
    SuperAdmin,
    Entry,
    User,
    sequelize,
    Sequelize
}