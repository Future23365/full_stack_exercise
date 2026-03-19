const express = require('express')
const router = express.Router()
// @ts-ignore
const { sequelize, User } = require('../../models')
const { Op } = require('sequelize')
const { success, fail } = require('../../utils/responses')
const { NotFoundError } = require('../../utils/erros')

router.get('/sex', async function(req, res) {
  try {

    const male = await User.count({ where: { sex: 0 } })
    const female = await User.count({ where: { sex: 1 } })
    const unknown = await User.count({ where: { sex: 2 } })
    const data = [
      {value: male, name: '男性'},
      {value: female, name: '女性'},
      {value: unknown, name: '未选择'}
    ]

    success(res, '用户性别查询成功', {
      data
    }
    )
  } catch(error) {
    fail(res, error)
  }
})

router.get('/user', async (req, res) => {
  try {
    const [results] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC")
    const data = {
      month: [],
      values: []
    }
    results.forEach(item => {
      data.month.push(item.month)
      data.values.push(item.value)
    })
    success(res, '查询每个月用户数量成功', { data })
  } catch(error) {
    fail(res, error)
  }
})

module.exports = router