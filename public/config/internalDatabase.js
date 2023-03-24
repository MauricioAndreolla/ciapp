const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './public/sqliteDatabases/internalDataBase.sqlite',
});

module.exports = sequelize;