const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class FichaMedicaDrogas extends Model { }

FichaMedicaDrogas.init({
  
}, {
    sequelize: Database.sequelize,
    modelName: 'FichaMedicaDrogas'
});

module.exports = FichaMedicaDrogas;