const Sequelize = require('sequelize');
const { modo } = require('../utils/appMode');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `C://ciapp/database/${modo === 0 ? "central" : "entidade"}/internalDataBase.sqlite`,
  pool: {
    max: 100,
    min: 1
  }
});

module.exports = sequelize;