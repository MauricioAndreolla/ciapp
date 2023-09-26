'use strict';
const Sequelize = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  name: '20230925232908-Alter_Nro_Processo',
  async up ({ context: queryInterface }) {

    const tableInfo = await queryInterface.describeTable('Processos');

    if (!tableInfo['temp_column']) {
      await queryInterface.addColumn('Processos', 'temp_column', {
        type: Sequelize.STRING, 
        allowNull: true,
      });
    }
   

    await queryInterface.changeColumn('Processos', 'nro_processo', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      `UPDATE Processos SET temp_column = nro_processo WHERE id = id`, 
      {
        type: Sequelize.QueryTypes.UPDATE,
      }
    );

    await queryInterface.sequelize.query(
      `UPDATE Processos SET nro_processo = NULL WHERE id = id`, 
      {
        type: Sequelize.QueryTypes.UPDATE,
      }
    );

    await queryInterface.changeColumn('Processos', 'nro_processo', {
      type: Sequelize.STRING, 
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      `UPDATE Processos SET nro_processo = temp_column WHERE id = id`, 
      {
        type: Sequelize.QueryTypes.UPDATE,
      }
    );

    await queryInterface.changeColumn('Processos', 'nro_processo', {
      type: Sequelize.STRING, 
      allowNull: false,
    });
    await queryInterface.removeColumn('Processos', 'temp_column');

  },

  async down ({ context: queryInterface }) {
    await queryInterface.removeColumn('Processos', 'temp_column');
  }
};
