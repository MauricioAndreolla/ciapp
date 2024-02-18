const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Familiar extends Model { }

Familiar.init({
    nome: {
        type: DataTypes.STRING,
    },

    parentesco: {
        type: DataTypes.NUMBER,
    },

    idade: {
        type: DataTypes.INTEGER,
    },

    profissao: {
        type: DataTypes.STRING,
    },


    ref_integracao: {
        type: DataTypes.INTEGER,
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    somente_leitura: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    sequelize: Database.sequelize,
    modelName: 'Familiares'
});

module.exports = Familiar;