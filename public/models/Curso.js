const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Curso extends Model { }

Curso.init({
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // instituicao: {
    //     type: DataTypes.STRING,
    // },

    observacao: {
        type: DataTypes.STRING,
    },

    ref_integracao: {
        type: DataTypes.INTEGER,
    }

}, {
    sequelize: Database.sequelize,
    modelName: 'Curso'
});

module.exports = Curso;