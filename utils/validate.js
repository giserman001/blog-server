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
      await schemaPack.validateAsync(params, { allowUnknown: true })
      return true
    } catch (err) {
      ctx.throw(400, err)
    }
  }

  module.exports = validate