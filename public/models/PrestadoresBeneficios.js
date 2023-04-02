const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class PrestadoresBeneficios extends Model { }

PrestadoresBeneficios.init({
  
}, {
    sequelize: Database.sequelize,
    modelName: 'PrestadoresBeneficios'
});

module.exports = PrestadoresBeneficios;