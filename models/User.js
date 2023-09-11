const {sequelize} = require('../db');
const {Sequelize} = require('sequelize');

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = {User};
