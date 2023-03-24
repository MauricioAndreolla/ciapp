const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Usuario extends Model { }

Usuario.init({
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: Database.sequelize,
    modelName: 'Usuario'
});

module.exports = Usuario;