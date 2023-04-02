const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class UF extends Model { }

UF.init({
    
    nome: DataTypes.STRING,
    sigla: DataTypes.STRING

}, {
    sequelize: Database.sequelize,
    modelName: 'UF'
});

module.exports = UF;