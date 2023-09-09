const {sequelize} = require('../db');
const { Sequelize } = require('sequelize');

const Entry = sequelize.define("entries", {
 title: Sequelize.STRING,
 date: Sequelize.STRING,
 text: Sequelize.STRING
});

module.exports = {
    db: sequelize,
    Entry
}