const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class RegistroAtendimento extends Model { }

RegistroAtendimento.init({
    dt_registro: {
        type: DataTypes.DATEONLY,
    },

    descricao: {
        type: DataTypes.TEXT,
    },
    ref_integracao: {
        type: DataTypes.INTEGER,
    },

}, {
    sequelize: Database.sequelize,
    modelName: 'RegistroAtendimento'
});

module.exports = RegistroAtendimento;