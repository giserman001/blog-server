const response = require('./response')
const validate = require('./validate')
module.exports = {
  client: response, // 快捷设置给客户端的 response
  validate
}
