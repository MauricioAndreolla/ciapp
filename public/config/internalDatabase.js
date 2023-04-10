const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'C://ciapp/database/internalDataBase.sqlite',
});

module.exports = sequelize;