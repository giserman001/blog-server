const Router = require('koa-router')
const router = new Router({prefix: '/user'})
const { getUserList } = require('../controllers/user')


router.get('/list', getUserList) // 获取用户列表

module.exports = router