const { Model, DataTypes } = require('sequelize');
const Database = require("../config/database");

  class AtestadoFrequencia extends Model {
   
    static associate(models) {
    }
  }
  AtestadoFrequencia.init({
    dt_entrada: { allowNull: false ,type: DataTypes.DATE},
    dt_saida: {allowNull: false, type: DataTypes.DATE},
    observacao: {allowNull: true ,type: DataTypes.STRING},
    ref_integracao: { allowNull: true, type: DataTypes.INTEGER}

  }, {
    sequelize: Database.sequelize,
    modelName: 'AtestadoFrequencia',
  });
  
module.exports = AtestadoFrequencia;
