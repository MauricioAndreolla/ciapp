const { Model, DataTypes } = require('sequelize');
const Database = require("../config/database");


class Agendamento extends Model {

  static associate(models) {
  }
}

Agendamento.init({

  horario_inicio: { allowNull: false, type: DataTypes.TIME },
  horario_fim: { allowNull: false, type: DataTypes.TIME },
  data_inicial: { allowNull: false, type: DataTypes.DATEONLY },
  data_final: { allowNull: true, type: DataTypes.DATEONLY },
  segunda: { allowNull: true, type: DataTypes.BOOLEAN },
  terca: { allowNull: true, type: DataTypes.BOOLEAN },
  quarta: { allowNull: true, type: DataTypes.BOOLEAN },
  quinta: { allowNull: true, type: DataTypes.BOOLEAN },
  sexta: { allowNull: true, type: DataTypes.BOOLEAN },
  sabado: { allowNull: true, type: DataTypes.BOOLEAN },
  domingo: { allowNull: true, type: DataTypes.BOOLEAN },
  ref_integracao: { allowNull: true, type: DataTypes.INTEGER }

}, {
  sequelize: Database.sequelize,
  modelName: 'Agendamento',
});

module.exports = Agendamento;