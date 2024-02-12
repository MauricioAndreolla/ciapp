'use strict';
const Sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  name: '20240212200519-Remove_Persecucao_Penal_Processo',
  async up ({ context: queryInterface }) {
    await queryInterface.removeColumn('Processos', 'persecucao_penal');
  },

  async down ({ context: queryInterface }) {
    await queryInterface.addColumn('Processos', 'persecucao_penal', {
      type: Sequelize.BOOLEAN
    });
  }
};
