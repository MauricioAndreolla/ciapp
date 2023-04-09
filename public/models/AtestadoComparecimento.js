const { Model, DataTypes } = require('sequelize');
const Database = require("../config/database");

class AtestadoComparecimento extends Model {

  static associate(models) {
  }
}
AtestadoComparecimento.init({
  observacao: { allowNull: true, type: DataTypes.STRING }
}, {
  sequelize: Database.sequelize,
  modelName: 'AtestadoComparecimento',
});

module.exports = AtestadoComparecimento;
