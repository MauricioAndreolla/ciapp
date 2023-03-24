const { DataTypes } = require('sequelize');
const sequelize = require('../config/internalDatabase');

const DbConfig = sequelize.define('DbConfig', {
    dialet: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    host: {
        type: DataTypes.STRING
    },
    port: {
        type: DataTypes.INTEGER
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
});

module.exports = DbConfig;