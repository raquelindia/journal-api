const {Sequelize, DataTypes} = require('sequelize');
const {sequelize} = require('../db');

const Entry = sequelize.define("entries", {
    title: {
        type: DataTypes.STRING

    },
    date: {
        type: DataTypes.DATE
    }

});