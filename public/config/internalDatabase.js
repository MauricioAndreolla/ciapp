const Sequelize = require('sequelize');
const { modo } = require('../utils/appMode');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `C://ciapp/database/${modo === 0 ? "central" : "entidade"}/internalDataBase.sqlite`,
});

module.exports = sequelize;