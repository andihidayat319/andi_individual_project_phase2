'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Types', [{
        name: 'Makanan Ringan',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: 'Makanan Instan',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: 'Makanan Segar & Beku',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: 'Roti',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: 'Susu',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jus',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: 'Coffe',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Types', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
