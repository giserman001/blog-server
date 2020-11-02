const Router = require('koa-router')
const router = new Router({prefix: '/user'})
const { getList } = require('../controllers/user')


router.get('/list', getList) // 获取用户列表

module.exports = router