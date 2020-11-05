const Joi = require('joi')
const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  comment: CommentModel,
  reply: ReplyModel,
  user: UserModel,
  sequelize,
} = require('../models')

class ArticleController {
  /**
   * 创建文章
   * @param {String} title - 文章标题
   * @param {String} content - 文章内容
   * @param {Array} categoryList - 文章分类
   * @param {Array} tagList - 文章标签
   */
  static async create(ctx) {
    const validator = await ctx.validate(ctx.request.body, {
      title: Joi.string().required(),
      content: Joi.string(),
      categoryList: Joi.array(),
      tagList: Joi.array()
    })
    if (validator) {
      const { title, content, categoryList, tagList } = ctx.request.body
      const res = await ArticleModel.findOne({ where: { title } })
      if (res) {
        ctx.throw(403, '创建失败，该文章已存在！')
      } else {
        const tags = tagList.map((t) => ({ name: t }))
        const categories = categoryList.map((t) => ({ name: t }))
        const data = await ArticleModel.create(
          // 这里为啥能和include里面model一一对应：这里key必须是表字段名字或者表名复数
          { title, categories, content, tags },
          {
            include: [TagModel, CategoryModel],
          }
        )
        ctx.client(data, '文章创建成功')
      }
    }
  }
}

module.exports = ArticleController
