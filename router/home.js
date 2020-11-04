const router = new require('koa-router')()
const { register, login } = require('../controllers/user')

// root
router.post('/login', login) // 登录
router.post('/register', register) // 注册

module.exports = router