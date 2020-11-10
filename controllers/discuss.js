const Joi = require('joi')
const { EMAIL_NOTICE } = require('../config')

const {
  article: ArticleModel,
  comment: CommentModel,
  reply: ReplyModel,
  user: UserModel,
  ip: IpModel,
  sequelize,
  Op,
} = require('../models')

class DiscussController {
  /**
   * 创建评论和回复
   * @param {Number} articleId - 文章 id
   * @param {Number} userId - 用户 id
   * @param {String} content - 评论内容
   * @param {Number} commentId - 评论 id
   * */
  static async create(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      articleId: Joi.number().required(), // 文章 id
      userId: Joi.number().required(), // 用户 id
      content: Joi.string().required(), // 评论 、回复的内容
      commentId: Joi.number(), // 回复相应的评论
    })
    if (validator) {
      const { articleId, userId, content } = ctx.request.body
      let commentId = ctx.request.body.commentId
      const ip = ctx.request.ip
      const user = await UserModel.findOne({ where: { id: userId } })
      const ipInfo = await IpModel.findOne({ where: { ip: ctx.request.ip }, attributes: ['auth'] })
      if (ipInfo && !ipInfo.auth) {
        ctx.throw(401, '该 IP 已被拉入黑名单')
      } else if (user.disabledDiscuss) {
        ctx.throw(401, '您已被禁言，请文明留言！')
      } else {
        if (!commentId) {
          // 添加评论
          const comment = await CommentModel.create({ userId, articleId, content })
          commentId = comment.id
        } else {
          // 回复
          await ReplyModel.create({ userId, articleId, content, commentId })
        }
        // 如果没找到，那么创建的内容是 defaults：{ userId, ip }
        await IpModel.findOrCreate({ where: { ip }, defaults: { userId, ip } })
        // TODO 发送邮件稍后做
        /**
         *  code.....
         * */
        ctx.client(null, '评论或者回复成功')
      }
    }
  }
  /**
   * 删除评论以及评论下面的回复
   * @param {Number} commentId - 评论id
   * */
  static async deleteComment(ctx) {
    const validator = ctx.validate(ctx.params, {
      commentId: Joi.number().required(),
    })
    if (validator) {
      const commentId = ctx.params.commentId
      //   await ReplyModel.destroy({where: {commentId}})
      //   await CommentModel.destroy({where: {id: commentId}})
      await sequelize.query(
        `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.id=${commentId}`
      )
      ctx.client(null, '删除评论成功')
    }
  }
  /**
   * 删除回复
   * @param {Number} replyId - 回复id
   * */
  static async deleteReply(ctx) {
    const validator = ctx.validate(ctx.params, {
      replyId: Joi.number().required(),
    })

    if (validator) {
      const replyId = ctx.params.replyId
      await ReplyModel.destroy({ where: { id: replyId } })
      ctx.client(null, '删除回复成功')
    }
  }
}

module.exports = DiscussController
