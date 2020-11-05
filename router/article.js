const Router = require('koa-router')
const router = new Router({ prefix: '/article' })
const { create } = require('../controllers/article')

router.post('/', create) // 创建文章

module.exports = router
