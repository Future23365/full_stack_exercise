'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Settings', [{
      name: "小测试",
      icp: '沪icp被902345号-1',
      copyright: 'sdkfsjkadfjasdklfjasdklfas',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Settings', null, {});
  }
};
