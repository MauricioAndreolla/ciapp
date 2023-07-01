'use strict';
const Sequelize = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  name: 'Nome da migração', //campo obrigatório, de preferencia o mesmo do arquivo gerado
  async up ({ context: queryInterface }) {
    
  },

  async down ({ context: queryInterface }) {
  }
};
