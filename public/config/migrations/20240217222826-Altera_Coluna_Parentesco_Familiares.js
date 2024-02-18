'use strict';
const Sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  name: '20240217222826-Altera_Coluna_Parentesco_Familiares',
  async up({ context: queryInterface }) {
    await queryInterface.sequelize.query(`
      UPDATE familiares 
      SET parentesco = NULL
    `);

    await queryInterface.changeColumn("familiares", "parentesco", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.changeColumn("familiares", "parentesco", {
      type: Sequelize.STRING,
      allowNull: true

    });
  }
};
