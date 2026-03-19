'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'aaa@sfds.com',
        username: 'admin',
        password: bcrypt.hashSync('123456', 10),
        nickname: '管理员',
        sex: 2,
        role: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'bbb@sdf.com',
        username: 'user',
        password: bcrypt.hashSync('123456', 10),
        nickname: '用户1',
        sex: 2,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'ccc@xvcxvxs.com',
        username: 'user1',
        password: bcrypt.hashSync('123456', 10),
        nickname: '用户2',
        sex: 2,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
