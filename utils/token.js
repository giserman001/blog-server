const jwt = require('jsonwebtoken')
const { TOKEN } = require('../config')

/**
 * 创建token
 * @param {Object} info - 存储在token中的值
 * @return {string} - token值
 */
exports.createToken = (info) => {
  return jwt.sign(info, TOKEN.secret, { expiresIn: TOKEN.expiresIn })
}

/**
 * 检查token
 * @param {Object} ctx app.context
 * @param {Array} roleList - 需要具备的权限 { role: 1, verifyTokenBy: 'url' }
 * @return {Boolean} - 是否通过验证
 */
exports.checkToken = (ctx, roleList) => {}
