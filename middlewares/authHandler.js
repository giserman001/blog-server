const { toTokenGetRole, checkToken } = require('../utils/token')
const { all_auth, checkAuth } = require('../utils/permission')

module.exports = async (ctx, next) => {
  const isCheck = checkToken(ctx, all_auth)
  if (isCheck) {
    const role = toTokenGetRole(ctx)
    const isAuth = checkAuth(ctx, role)
    if (isAuth) {
      await next()
    } else {
      ctx.throw(401, '当前用户无权限')
    }
  } else {
    ctx.throw(401, 'token无效')
  }
}
