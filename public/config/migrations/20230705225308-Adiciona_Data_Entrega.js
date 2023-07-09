'use strict';
const Sequelize = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  name: '20230705224216-Adiciona_Data_Entrega',
  async up ({ context: queryInterface }) {
    await queryInterface.addColumn('Entidades', 'data_entrega', {
      type: Sequelize.DATE, 
      allowNull: true,
    });
  },

  async down ({ context: queryInterface }) {
    await queryInterface.removeColumn('Entidade', 'data_entrega');
  }
};
