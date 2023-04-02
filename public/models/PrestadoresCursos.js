const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class PrestadoresCursos extends Model { }

PrestadoresCursos.init({
  
}, {
    sequelize: Database.sequelize,
    modelName: 'PrestadoresCursos'
});

module.exports = PrestadoresCursos;