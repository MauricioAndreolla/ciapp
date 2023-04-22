const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Droga extends Model { }

Droga.init({
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    observacao: {
        type: DataTypes.TEXT,
    },

    ref_integracao: {
        type: DataTypes.INTEGER,
    }
    ,
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
    modelName: 'Drogas'
});

module.exports = Droga;