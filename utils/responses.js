
function success(res, message, data = {}, code = 200) {
  res.status(code).json({
    message,
    data,
    status: true
  })
}

function fail(res, error) {
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(e => e.message)
    return res.status(400).json({
      status: false,
      message: '请求参数错误',
      errors
    })
  } else if (error.name === 'NotFoundError') {
    return res.status(404).json({
      status: false,
      message: '资源不存在',
      errors: [error.message]
    })
  } else if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: [error.message]
    })
  } else if (error.name === 'BadRequestError') {
    return res.status(400).json({
      status: false,
      message: '请求参数错误',
      errors: [error.message]
    })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(403).json({
      status: false,
      message: '认证失败',
      errors: ['token错误']
    })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(403).json({
      status: false,
      message: '认证失败',
      errors: ['token过期']
    })
  }

  res.status(500).json({
    status: false,
    message: '服务器错误',
    errors: [error.message]
  })
}



module.exports = {
  success,
  fail
}