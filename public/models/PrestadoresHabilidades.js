const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class PrestadoresHabilidades extends Model { }

PrestadoresHabilidades.init({
  
}, {
    sequelize: Database.sequelize,
    modelName: 'PrestadoresHabilidades'
});

module.exports = PrestadoresHabilidades;