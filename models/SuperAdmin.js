const {sequelize} = require('../db');
const {Sequelize} = require('sequelize');

const SuperAdmin = sequelize.define('superadmin', {
     username: Sequelize.STRING
});

module.exports = { SuperAdmin };
