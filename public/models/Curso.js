const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Curso extends Model { }

Curso.init({
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    // instituicao: {
    //     type: DataTypes.STRING,
    // },

    observacao: {
        type: DataTypes.TEXT,
    },

    ref_integracao: {
        type: DataTypes.INTEGER,
    }
    ,
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
    modelName: 'Curso'
});

module.exports = Curso;