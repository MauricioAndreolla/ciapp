const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Usuario extends Model { }

Usuario.init({
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.TEXT,
        allowNull: false
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
    modelName: 'Usuario'
});

module.exports = Usuario;