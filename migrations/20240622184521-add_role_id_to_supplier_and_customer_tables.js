'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Suppliers', 'roleId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Customers', 'roleId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Suppliers', 'roleId');
    await queryInterface.removeColumn('Customers', 'roleId');
  }
};
