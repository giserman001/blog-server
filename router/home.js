const router = new require('koa-router')()
const { register } = require('../controllers/user')

// root
router.post('/register', register) // 注册

module.exports = router