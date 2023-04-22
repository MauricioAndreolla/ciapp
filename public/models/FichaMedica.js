const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class FichaMedica extends Model { }

FichaMedica.init({
    deficiencia: {
        type: DataTypes.INTEGER,
    },

    observacao: {
        type: DataTypes.TEXT,
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
    modelName: 'FichaMedica'
});

module.exports = FichaMedica;