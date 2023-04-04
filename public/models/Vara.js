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
    }

}, {
    sequelize: Database.sequelize,
    modelName: 'Vara'
});

module.exports = Vara;