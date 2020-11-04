const Joi = require('joi')
const { user: UserModel, Op } = require('../models')
const { comparePassword, encrypt } = require('../utils/bcrypt')
const { createToken } = require('../utils/token')
class UserController {
  /**
   * 获取用户列表
   */
  static async getUserList(ctx) {
    const validator = ctx.validate(ctx.query, {
      username: Joi.string().allow(''),
      type: Joi.number(), // 检索类型 type = 1 github 用户 type = 2 站内用户 不传则检索所有
      startData: Joi.string(),
      endData: Joi.string(),
      page: Joi.number(),
      pageSize: Joi.number(),
    })
    if (validator) {
      const { username, type, startData, endData, page = 1, pageSize = 10 } = ctx.query
      let rangeData = []
      if (startData && endData) {
        rangeData = [startData, endData]
      }
      let where = { role: { [Op.not]: 1 } }
      if (username) {
        where = { ...where, username: { [Op.substring]: username } }
      }
      if (+type === 2) {
        where = { ...where, github: { [Op.eq]: null } }
      } else if (+type === 1) {
        where = { ...where, github: { [Op.not]: null } }
      }
      if (Array.isArray(rangeData) && rangeData.length === 2) {
        where = { ...where, createdAt: { [Op.between]: rangeData } }
      }
      const { count, rows } = await UserModel.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
        // row: true,
        order: [['createdAt', 'DESC']],
      })
      ctx.client(
        {
          page: {
            total: count,
            pageSize,
            currentPage: page,
          },
          list: rows,
        },
        'success'
      )
    }
  }
  /**
   * 用户注册
   * @param {String} username - 用户名
   * @param {String} password - 密码
   * @param {String} email - 邮箱
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
      if (res) {
        ctx.throw(403, '邮箱已被注册')
      } else {
        const user = await UserModel.findOne({ where: { username } })
        if (user && !user.github) {
          ctx.throw(403, '用户名已被占用')
        } else {
          const saltPassword = await encrypt(password)
          await UserModel.create({ username, password: saltPassword, email })
          ctx.client(null, '注册成功')
        }
      }
    }
  }
  /**
   * 用户登录
   * @param {String} code - github
   * @param {String} ctx - koa上下文
   */
  static async login(ctx) {
    const { code } = ctx.request.body
    if (code) {
      await UserController.githubLogin(ctx, code)
    } else {
      await UserController.defaultLogin(ctx)
    }
  }
  /**
   * 站内用户登录
   * @param {String} account - 用户名
   * @param {String} password - 密码
   */
  static async defaultLogin(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      account: Joi.string().required(),
      password: Joi.string(),
    })
    if (validator) {
      const { account, password } = ctx.request.body
      const user = await UserModel.findOne({
        where: { username: account },
      })
      if (!user) {
        ctx.throw(403, '用户不存在')
      } else {
        const isMath = await comparePassword(password, user.password)
        if (!isMath) {
          ctx.throw(403, '密码不正确')
        } else {
          const { id, role } = user
          // 生成token
          const token = createToken({ username: user.username, userId: id, role })
          ctx.client(
            {
              username: user.username,
              role,
              userId: id,
              token,
            },
            '登录成功'
          )
        }
      }
    }
  }
  /**
   * github用户登录
   * @param {String} username - 用户名
   * @param {String} password - 密码
   * @param {String} email - 邮箱
   */
  static async githubLogin(ctx, code) {
    console.log(ctx, code)
  }
}

module.exports = UserController
