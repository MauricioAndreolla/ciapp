const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Cidade extends Model { }

Cidade.init({
    nome: DataTypes.STRING

}, {
    sequelize: Database.sequelize,
    modelName: 'Cidade'
});

module.exports = Cidade;