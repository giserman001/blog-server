const Router = require('koa-router')
const router = new Router({ prefix: '/article' })
const {
  create,
  getArticleDetail,
  getArticleList,
  updateArticle,
  deleteArticle,
} = require('../controllers/article')

router.post('/', create) // 创建文章
router.get('/list', getArticleList) // 获取文章列表
router.get('/:id', getArticleDetail) // 获取文章详情
router.put('/:id', updateArticle) // 修改文章
router.delete('/del', deleteArticle) // 删除指定文章

module.exports = router
