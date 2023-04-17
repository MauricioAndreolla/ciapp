const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Endereco extends Model { }

Endereco.init({
    cep: DataTypes.STRING,
    rua: DataTypes.STRING,
    numero: DataTypes.STRING,
    bairro: DataTypes.STRING,
    complemento: DataTypes.TEXT,
    ref_integracao: DataTypes.INTEGER

}, {
    sequelize: Database.sequelize,
    modelName: 'Endereco'
});

module.exports = Endereco;