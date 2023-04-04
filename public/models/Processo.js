const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class Processo extends Model { }

Processo.init({
    nro_processo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
  
    nro_artigo_penal: {
        type: DataTypes.STRING
    },

    pena_originaria: {
        type: DataTypes.STRING
    },
    inciso: {
        type: DataTypes.STRING
    },
    detalhamento: {
        type: DataTypes.STRING
    },
    prd: {
        type: DataTypes.BOOLEAN
    },
    prd_descricao: {
        type: DataTypes.STRING
    },
    persecucao_penal: {
        type: DataTypes.BOOLEAN
    },
    pena_originaria_regime: {
        type: DataTypes.STRING
    },
    horas_cumprir: {
        type: DataTypes.DOUBLE
    },
    qtd_penas_anteriores: {
        type: DataTypes.INTEGER
    },
    possui_multa: {
        type: DataTypes.BOOLEAN
    },
    valor_a_pagar: {
        type: DataTypes.DOUBLE
    },
    ref_integracao: {
        type: DataTypes.INTEGER,
    }

}, {
    sequelize: Database.sequelize,
    modelName: 'Processo'
});

module.exports = Processo;