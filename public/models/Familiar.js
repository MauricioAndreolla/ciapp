const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Familiar extends Model { }

Familiar.init({
    nome: {
        type: DataTypes.STRING,
    },

    parentesco: {
        type: DataTypes.STRING,
    },

    idade: {
        type: DataTypes.INTEGER,
    },

    profissao: {
        type: DataTypes.STRING,
    },


    ref_integracao: {
        type: DataTypes.INTEGER,
    }

}, {
    sequelize: Database.sequelize,
    modelName: 'Familiares'
});

module.exports = Familiar;