// import models
const { tag: TagModel, category: CategoryModel, sequelize, Op } = require('../models')

class TagController {
  /**
   * 获取所有标签
   * */
  static async getTagList(ctx) {
    const data = await TagModel.findAll({
      attributes: ['id', 'name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name',
      where: {
        articleId: {
          [Op.not]: null,
        },
      },
      order: [[sequelize.fn('COUNT', sequelize.col('name')), 'desc']],
    })
    ctx.client(data, '成功')
  }
  /**
   * 获取所有分类
   * */
  static async getCategoryList(ctx) {
    const data = await CategoryModel.findAll({
      attributes: ['id', 'name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name',
      where: {
        articleId: {
          [Op.not]: null,
        },
      },
      order: [[sequelize.fn('COUNT', sequelize.col('name')), 'desc']],
    })
    ctx.client(data, '成功')
  }
}

module.exports = TagController
