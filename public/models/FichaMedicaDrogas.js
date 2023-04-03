const { Model, DataTypes } = require('sequelize');

const Database = require("../config/database");

class FichaMedicaDrogas extends Model { }

FichaMedicaDrogas.init({
    frequencia: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize: Database.sequelize,
    modelName: 'FichaMedicaDrogas'
});

module.exports = FichaMedicaDrogas;