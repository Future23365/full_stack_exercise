const express = require('express')
const router = express.Router()
// @ts-ignore
const { Setting } = require('../models')
const { success, fail } = require('../utils/responses')


router.get('/', async (req, res) => {
  try {

    const settings = await Setting.findOne()

    success(res, '获取首页数据成功', {
      settings
    })


  } catch(error) {
    fail(res, error)
  }
})



module.exports = router;
