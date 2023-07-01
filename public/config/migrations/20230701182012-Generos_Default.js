'use strict';
const Sequelize = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  name: '20230701182012-Generos_Default',
  async up({ context: queryInterface }) {
    await queryInterface.bulkInsert('Generos', [
      { descricao: 'Masculino', createdAt: new Date(), updatedAt: new Date(), },
      { descricao: 'Feminino', createdAt: new Date(), updatedAt: new Date(), },
    ], {});
  },

  async down({ context: queryInterface }) {
  }
};
