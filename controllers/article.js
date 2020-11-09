const Joi = require('joi')
const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  comment: CommentModel,
  reply: ReplyModel,
  user: UserModel,
  sequelize,
  Op,
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
      tagList: Joi.array(),
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
  /**
   * 获取文章详情
   * @param {Number} id - 文章id
   * @param {Number} type - 是否增加浏览次数
   */
  static async getArticleDetail(ctx) {
    const validator = await ctx.validate(
      { ...ctx.params, ...ctx.query },
      {
        id: Joi.number().required(),
        type: Joi.number(),
      }
    )
    if (validator) {
      const data = await ArticleModel.findOne({
        where: { id: ctx.params.id },
        include: [
          // 查找 分类 标签 评论 回复... TODO 暂时先只查询：分类 标签，评论和回复后续添加
          { model: TagModel, attributes: ['name'] },
          { model: CategoryModel, attributes: ['name'] },
        ],
      })
      const { type = 1 } = ctx.query
      // view count 预览次数
      type === 1 &&
        (await ArticleModel.update(
          { viewCount: ++data.viewCount },
          { where: { id: ctx.params.id } }
        ))
      ctx.client(data, '详情获取成功')
    }
  }
  /**
   * 获取文章列表
   * @param {Number} page - 页码
   * @param {Number} pageSize - 每页数据条数
   * @param {String} keyword - 关键字查询
   * @param {String} category - 分类
   * @param {String} tag - 标签
   * @param {Number} preview - 预览
   * @param {String} order - 排序
   */
  static async getArticleList(ctx) {
    const validator = await ctx.validate(ctx.query, {
      page: Joi.string(),
      pageSize: Joi.number(),
      keyword: Joi.string().allow(''), // 关键字查询
      category: Joi.string().allow(''),
      tag: Joi.string().allow(''),
      preview: Joi.number(),
      order: Joi.string().allow(''),
    })
    if (validator) {
      const { page = 1, pageSize = 10, preview = 1, keyword = '', tag, category, order } = ctx.query
      const tagFilter = tag ? { name: tag } : null
      const categoryFilter = category ? { name: category } : null
      let articleOrder = [['createdAt', 'DESC']]
      if (order) {
        articleOrder = [order.split(' ')]
      }
      const { count, rows } = await ArticleModel.findAndCountAll({
        where: {
          id: {
            [Op.not]: -1,
          },
          [Op.or]: [
            { title: { [Op.substring]: keyword } },
            { content: { [Op.substring]: keyword } },
          ],
        },
        include: [
          // TODO 这里暂时只考虑分类和标签
          { model: TagModel, attributes: ['name'], where: tagFilter },
          { model: CategoryModel, attributes: ['name'], where: categoryFilter },
        ],
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
        order: articleOrder,
        row: true,
        // distinct: true, // count 计算
      })
      // 只是获取预览，减少打了的数据传输。。。 TODO 后续添加
      // if (preview) {
      //   data.rows.forEach((d) => {
      //     d.content = d.content.slice(0, 1000)
      //   })
      // }
      ctx.client(
        {
          page: {
            total: count,
            pageSize,
            currentPage: page,
          },
          list: rows,
        },
        '成功'
      )
    }
  }
  /**
   * 修改文章
   * @param {Number} articleId - 文章id
   * @param {String} title - 文章标题
   * @param {String} content - 文章内容
   * @param {Array} categories - 文章分类
   * @param {Array} tags - 文章标签
   */
  static async updateArticle(ctx) {
    const validator = await ctx.validate(
      { articleId: ctx.params.id, ...ctx.request.body },
      {
        articleId: Joi.number().required(),
        title: Joi.string(),
        content: Joi.string(),
        categories: Joi.array(),
        tags: Joi.array(),
      }
    )
    if (validator) {
      const { title, content, categories = [], tags = [] } = ctx.request.body
      const articleId = parseInt(ctx.params.id)
      const tagList = tags.map((tag) => ({ name: tag, articleId }))
      const categoryList = categories.map((cate) => ({ name: cate, articleId }))
      await ArticleModel.update({ title, content }, { where: { id: articleId } })
      await TagModel.destroy({ where: { articleId } })
      await TagModel.bulkCreate(tagList)
      await CategoryModel.destroy({ where: { articleId } })
      await CategoryModel.bulkCreate(categoryList)
      ctx.client(null, '修改成功')
    }
  }
  /**
   * 删除文章(一篇或者多篇)
   * @param {Number} id - 文章id TODO 等评论和回复做好
   */
  static async deleteArticle(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      ids: Joi.array().required(),
    })
    if (validator) {
      // 删除文章的评论，回复，分类以及标签
      const articleIdArr = ctx.request.body.ids
      articleIdArr.forEach(async (articleId) => {
        await TagModel.destroy({ where: { articleId } })
        await CategoryModel.destroy({ where: { articleId } })
        await CommentModel.destroy({ where: { articleId } })
        await ReplyModel.destroy({ where: { articleId } })
        await ArticleModel.destroy({ where: { id: articleId } })
        // await sequelize.query(
        //   `delete comment, reply, category, tag, article
        //   from article
        //   left join reply on article.id=reply.articleId
        //   left join comment on article.id=comment.articleId
        //   left join category on article.id=category.articleId
        //   left join tag on article.id=tag.articleId
        //   where article.id=${articleId}`
        // )
      })
      ctx.client(null, '删除成功')
    }
  }
}

module.exports = ArticleController
