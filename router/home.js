const router = new require('koa-router')()
const { register, login } = require('../controllers/user')
const { getTagList, getCategoryList } = require('../controllers/tag')

// root
router.post('/login', login) // 登录
router.post('/register', register) // 注册

// tag category
router.get('/tag/list', getTagList) // 获取所有的 tag 列表
router.get('/category/list', getCategoryList) // 获取 category 列表

module.exports = router