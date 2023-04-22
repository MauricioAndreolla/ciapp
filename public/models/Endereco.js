const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Endereco extends Model { }

Endereco.init({
    cep: DataTypes.STRING,
    rua: DataTypes.STRING,
    numero: DataTypes.STRING,
    bairro: DataTypes.STRING,
    complemento: DataTypes.TEXT,
    ref_integracao: DataTypes.INTEGER,
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
    modelName: 'Endereco'
});

module.exports = Endereco;