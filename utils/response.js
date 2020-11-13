/**
 * @param {String} message - 提示语
 * @param {any} data - 返回给客户端的值
 * @param {any} code - code值
 * @example app.context.client = func , ctx.client(10, '成功')
 */
module.exports = function (data = null, msg = '请求成功', code = 200) {
  const ctx = this
  ctx.response.set('Content-Type', 'application/json')
  ctx.response.body = {
    code,
    msg,
    data
  }
}
