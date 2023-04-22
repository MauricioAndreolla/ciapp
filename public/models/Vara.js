const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Vara extends Model { }

Vara.init({
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
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
    modelName: 'Vara'
});

module.exports = Vara;