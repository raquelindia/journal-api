const {Entry} = require('./Entry');
const {User} = require('./User');
const {sequelize, Sequelize} = require('../db');

Entry.belongsTo(User, {foreignKey: 'ownerId'});
User.hasMany(Entry);

module.exports = {
    Entry,
    User,
    sequelize,
    Sequelize
}