const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Genero extends Model { }

Genero.init({
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ref_integracao: {
        type: DataTypes.INTEGER,
    },

}, {
    sequelize: Database.sequelize,
    modelName: 'Genero'
});

module.exports = Genero;