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
    }

}, {
    sequelize: Database.sequelize,
    modelName: 'FichaMedica'
});

module.exports = FichaMedica;