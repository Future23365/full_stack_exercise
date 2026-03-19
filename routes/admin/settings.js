const express = require('express')
const router = express.Router()
// @ts-ignore
const { Setting } = require('../../models')
const { success, fail } = require('../../utils/responses')
const { NotFoundError } = require('../../utils/erros')



router.get('/', async function(req, res) {
  try {
    const setting = await getSetting()
    success(res, '设置查询成功', setting)
  } catch(error) {
    fail(res, error)

  }
})



router.put('/', async function(req, res) {
  const body = {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright
  }
  try {
    const setting = await getSetting()
    await setting.update(body)
    success(res, '更新成功')

  } catch(error) {
    fail(res, error)

  }
})


async function getSetting() {
  const setting = await Setting.findOne()
  if (!setting) {
    throw new NotFoundError(`初试设置没找到，运行种子文件`)
  }

  return setting
}




module.exports = router
