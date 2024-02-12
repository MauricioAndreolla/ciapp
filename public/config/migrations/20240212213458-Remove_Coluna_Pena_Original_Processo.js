'use strict';
const Sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  name: '20240212213458-Remove_Coluna_Pena_Original_Processo',
  async up ({ context: queryInterface }) {
    await queryInterface.removeColumn('Processos', 'pena_originaria');
  },

  async down ({ context: queryInterface }) {
    await queryInterface.addColumn('Processos', 'pena_originaria', {
      type: DataTypes.TEXT
    });
  }
};
