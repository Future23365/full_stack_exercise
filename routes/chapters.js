const express = require('express')
const router = express.Router()
// @ts-ignore
const { Course, Category, Chapter, User } = require('../models')
const { success, fail } = require('../utils/responses')
const { NotFoundError } = require('../utils/erros')

// router.get('/', async(req, res) => {
//   try {
//     const query = req.query
//     const currentPage = Math.abs(Number(req.query.currentPage)) || 1
//     const pageSize = Math.abs(Number(req.query.pageSize)) || 10

//     const offset = (currentPage - 1) * pageSize

//     if (!query.categoryId) {
//       throw new Error('获取课程列表失败, 分类id不能为空')
//     }

//     const condition = {
//       attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
//       where: { categoryId: query.categoryId },
//       order: [['id', 'DESC']],
//       limit: pageSize,
//       offset: offset
//     }

//     const { count, rows } = await Course.findAndCountAll(condition)
//     success(res, '查询课程列表成功', {
//       course: rows,
//       pagination: {
//         total: count,
//         currentPage,
//         pageSize
//       }
//     })
//   } catch(error) {
//     fail(res, error)
//   }
// })


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const condition = {
      attributes: { exclude: ['CourseId'] },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname', 'avatar', 'company']
            }
          ]
        }
      ]
    }

  const chapter = await Chapter.findByPk(id, condition)
  if (!chapter) {
    throw new NotFoundError(`Id: ${id} 的章节未找到`)
  }
  const chapters = await Chapter.findAll({
    attributes: { exclude: ['CourseId', 'content'] },
    where: { courseId: chapter.courseId },
    order: [['rank', 'ASC'], ['id', 'DESC']]
  })

  success(res, '查询章节成功', { chapter, chapters })
  } catch(error) {
    fail(res, error)
  }
})

module.exports = router