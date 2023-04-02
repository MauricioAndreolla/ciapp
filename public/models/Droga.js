const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Droga extends Model { }

Droga.init({
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    observacao: {
        type: DataTypes.STRING,
    },

    ref_integracao: {
        type: DataTypes.INTEGER,
    }

}, {
    sequelize: Database.sequelize,
    modelName: 'Drogas'
});

module.exports = Droga;