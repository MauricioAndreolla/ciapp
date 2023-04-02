const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Beneficio extends Model { }

Beneficio.init({
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
    modelName: 'Beneficio'
});

module.exports = Beneficio;