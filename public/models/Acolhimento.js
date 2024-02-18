const { Model, DataTypes } = require('sequelize');
const Database = require("../config/database");

  class Acolhimento extends Model {
   
    static associate(models) {
    }
  }
  Acolhimento.init({
    dt_agendamento: { allowNull: false ,type: DataTypes.DATE},
    ref_integracao: { allowNull: true, type: DataTypes.INTEGER}

  }, {
    sequelize: Database.sequelize,
    modelName: 'Acolhimento',
  });
  
module.exports = Acolhimento;
