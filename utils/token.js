const jwt = require('jsonwebtoken')
const { TOKEN } = require('../config')

/**
 * 创建token
 * @param {Object} info - 存储在token中的值
 * @return {string} - token值
 */
const createToken = (info) => {
  return jwt.sign(info, TOKEN.secret, { expiresIn: TOKEN.expiresIn })
}

/**
 * 检查token
 * @param {Object} ctx app.context
 * @param {Array} roleList - 需要具备的权限 { role: 1, verifyTokenBy: 'url' }
 * @return {Boolean} - 是否通过验证
 */
const checkToken = (ctx, all_auth) => {
  const { method, url } = ctx
  const is = all_auth.some((v) => {
    return v.regexp.test(url) && (v.required === 'all' || v.required.toUpperCase().includes(method))
  })
  if (is) {
    const { role } = toTokenGetRole(ctx)
    if (role) return true
    return false
  }
  return true
}
/**
 * 通过token获取role角色: 获取role成功则说明token验证成功
 * @param {Object} ctx app.context
 */
const toTokenGetRole = (ctx) => {
  let decoded = ''
  const token = getHeadersToken(ctx)
  if (token) {
    decoded = jwt.verify(token, TOKEN.secret) // {username: 'liuya',userId: 47529565,role: 1,iat: 1608012345,exp: 1610604345}
  }
  return decoded
}

/**
 * 获取headers/query里面token
 * @param {Object} ctx app.context
 */
function getHeadersToken(ctx) {
  let token = ''
  const tokenHeader = ctx.headers['authorization']
  const { tokenQuery } = ctx.query
  if (tokenHeader || tokenQuery) {
    token = (tokenHeader || tokenQuery).split(' ')[1]
  }
  return token
}

module.exports = {
  createToken,
  checkToken,
  toTokenGetRole,
}
