const {sequelize} = require('../db');
const { DataTypes } = require('sequelize');

const Entry = sequelize.define("Entry", {
   title: {
    type: DataTypes.STRING,
    allowNull: false
},
   date: { 
    type: DataTypes.STRING,
    allowNull: false
},
   text: { 
    type: DataTypes.STRING,
    allowNull: false
}
});

module.exports = {
    Entry
}