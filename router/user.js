const Router = require('koa-router')
const router = new Router({prefix: '/user'})
const { getUserList, updateUser, deleteUser: del } = require('../controllers/user')


router.get('/list', getUserList) // 获取用户列表
router.put('/:userId', updateUser) // 更新用户信息
router.delete('/:userId', del) // 删除用户

module.exports = router