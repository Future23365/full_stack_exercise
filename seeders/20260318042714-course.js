'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Courses', [
      {
        categoryId: 1,
        userId: 1,
        name: 'css入门',
        recommended: true,
        introductory: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoryId: 2,
        userId: 1,
        name: 'nodejs实战课程',
        recommended: true,
        introductory: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {});
  }
};
