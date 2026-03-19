const express = require('express')
const router = express.Router()
// @ts-ignore
const { Category } = require('../models')
const { success, fail } = require('../utils/responses')

router.get('/', async(req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['rank', 'ASC'], ['id', 'DESC']]
    })
    success(res, '查询分类成功', { categories })
  } catch(error) {
    fail(res, error)
  }
})

module.exports = router