const Joi = require('joi')
const { user: UserModel } = require('../models')
const { comparePassword, encrypt } = require('../utils/bcrypt')
class UserController {
  /**
   * 读取用户列表
   */
  static async getList(ctx) {
    console.log('获取用户列表')
  }
  /**
   * 注册用户
   * @param {String} username - github 登录名
   */
  static async register(ctx) {
    const params = ctx.request.body
    const validator = await ctx.validate(params, {
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    })
    if (validator) {
      const { username, password, email } = params
      const res = await UserModel.findOne({ where: { email } })
      if(res) {
        ctx.throw(403, '邮箱已被注册')
      } else {
        const user = await UserModel.findOne({ where: { username } })
        if(user && !user.github) {
          ctx.throw(403, '用户名已被占用')
        } else {
          const saltPassword = await encrypt(password)
          await UserModel.create({username, password: saltPassword, email})
          ctx.body = {
            code: 200,
            data: null,
            msg: '注册成功'
          }
        }
      }
    }
  }
}

module.exports = UserController
