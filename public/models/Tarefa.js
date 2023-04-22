const { Model, DataTypes } = require('sequelize');
const Database = require("../config/database");


class Tarefa extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
  }
}

Tarefa.init({

  titulo: { allowNull: false, type: DataTypes.STRING },
  descricao: { allowNull: true, type: DataTypes.TEXT },
  status: { allowNull: false, type: DataTypes.BOOLEAN },
  ref_integracao: { allowNull: true, type: DataTypes.INTEGER },
  somente_leitura: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
  }
}, {
  sequelize: Database.sequelize,
  modelName: 'Tarefa',
});


module.exports = Tarefa;  