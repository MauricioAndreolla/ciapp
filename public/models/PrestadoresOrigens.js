const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class PrestadoresOrigens extends Model { }

PrestadoresOrigens.init({
  
}, {
    sequelize: Database.sequelize,
    modelName: 'PrestadoresOrigens'
});

module.exports = PrestadoresOrigens;