'use strict';
const Sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  name: '20230723220809-Origens_Default',
  async up({ context: queryInterface }) {
    await queryInterface.bulkInsert('Origems', [
      { descricao: 'Execução Penal', createdAt: new Date(), updatedAt: new Date(), },
      { descricao: 'Acordo de não persecução penal', createdAt: new Date(), updatedAt: new Date(), },
      { descricao: 'Suspensão do processo', createdAt: new Date(), updatedAt: new Date(), },
      { descricao: 'Suspensão de pena', createdAt: new Date(), updatedAt: new Date(), },
      { descricao: 'Transação penal', createdAt: new Date(), updatedAt: new Date(), },
      { descricao: 'Concluídos último ano', createdAt: new Date(), updatedAt: new Date(), },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
