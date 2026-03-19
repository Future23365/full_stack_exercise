'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Chapters', [
      {
        courseId: 1,
        title: 'css 课程介绍',
        content: '这是一门css的课程。。。。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 2,
        title: 'nodejs 课程介绍',
        content: '这是一门nodem=js的课程。。。。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 2,
        title: 'python 课程介绍',
        content: '这是一门python的课程。。。。',
        video: '',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Chapter', null, {})
  }
};
