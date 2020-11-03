const Joi = require('joi')

/**
 * @param {object} params - 需要被验证 key-value
 * @param {object} schema - 验证规则
 * @return Promise
 */

async function validate(params, schema) {
  const ctx = this
  const schemaPack = Joi.object(schema)
  try {
    const value = await schemaPack.validateAsync(params, { allowUnknown: true })
    if (value.error) {
      ctx.body = {
        code: 400,
        msg: value.error,
        data: null,
      }
      return false
    }
    return true
  } catch (err) {
    ctx.body = {
      code: 400,
      msg: err.details[0].message,
      data: null,
    }
    // ctx.throw(400, err)
    return false
  }
}

module.exports = {
  validate,
}
