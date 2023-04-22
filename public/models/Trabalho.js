const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Trabalho extends Model { }

Trabalho.init({
    descricao: {
        type: DataTypes.TEXT,
    },

    horario_inicio: {
        type: DataTypes.TIME,
    },

    horario_fim: {
        type: DataTypes.TIME,
    },

    segunda: {
        type: DataTypes.BOOLEAN
    }
    ,
    terca: {
        type: DataTypes.BOOLEAN
    }
    ,
    quarta: {
        type: DataTypes.BOOLEAN
    }
    ,
    quinta: {
        type: DataTypes.BOOLEAN
    }
    ,
    sexta: {
        type: DataTypes.BOOLEAN
    }
    ,
    sabado: {
        type: DataTypes.BOOLEAN
    }
    ,
    domingo: {
        type: DataTypes.BOOLEAN
    }
    ,

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
    modelName: 'Trabalho'
});

module.exports = Trabalho;