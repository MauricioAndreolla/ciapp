const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const teste = sequelize.define('TESTE', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = teste;