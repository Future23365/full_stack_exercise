const express = require('express')
const router = express.Router()
// @ts-ignore
const { Course, Category, User } = require('../models')
const { Op } = require('sequelize')
const { success, fail } = require('../utils/responses')
const { NotFoundError } = require('../utils/erros')


router.get('/', async (req, res) => {
  try {

    const recommendedCourses = await Course.findAll({
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar', 'company']
        }
      ],
      where: { recommended: true },
      order: [['id', 'desc']],
      limit: 10
    })
    const likesCourse = await Course.findAll({
      attributes: { exclude: ['CategoryId', 'UserId', 'Content'] },
      order: [['likesCount', 'desc'], ['id', 'desc']],
      limit: 10
    })

    const introductoryCourses = await Course.findAll({
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      where: { introductory: true },
      order: [['id', 'desc']],
      limit: 10
    })

    success(res, '获取首页数据成功', {
      recommendedCourses,
      likesCourse,
      introductoryCourses
    })

  } catch(error) {
    fail(res, error)
  }
})



module.exports = router;
