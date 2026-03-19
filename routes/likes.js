const express = require('express')
const router = express.Router()
// @ts-ignore
const { Like, Course, User } = require('../models')
const { success, fail } = require('../utils/responses')
const { NotFoundError } = require('../utils/erros')


router.post('/', async (req, res) => {
  try {

    const userId = req.userId
    const { courseId } = req.body
    const course = await Course.findByPk(courseId)
    if (!courseId) {
      throw new NotFoundError('课程不存在')
    }

    const like = await Like.findOne({
      where: {
        courseId,
        userId
      }
    })

    if (!like) {
      await Like.create({ courseId, userId })
      await course.increment('likesCount')
      success(res, '点赞成功')
    } else {
      await like.destroy()
      await course.decrement('likesCount')
      success(res, '取消点赞')
    }

  } catch(error) {
    fail(res, error)
  }
})

router.get('/', async function(req, res) {
  try {

    const query = req.query
    const currentPage = Math.abs(Number(req.query.currentPage)) || 1
    const pageSize = Math.abs(Number(req.query.pageSize)) || 10

    const offset = (currentPage - 1) * pageSize

    const user = await User.findByPk(req.userId)

    const courses = await user.getLikeCourses({
      joinTableAttributes: [],
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    })

    const count = await user.countLikeCourses()

    success(res, '查询用户点赞的课程橙色', {
      courses,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    })

  } catch(error) {
    fail(res, error)
  }
})



module.exports = router;
