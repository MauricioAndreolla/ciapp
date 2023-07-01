'use strict';
const Sequelize = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  name: '20230701175658-FK_Genero_Prestador',
  async up ({ context: queryInterface }) {
    await queryInterface.addColumn('Prestadores', 'GeneroId', {
      type: Sequelize.INTEGER, 
      allowNull: true,
      references: {
        model: 'Generos', 
        key: 'id' 
      }
    });
  },

  async down ({ context: queryInterface }) {
    await queryInterface.removeColumn('Prestadores', 'GeneroId');
  }
};
