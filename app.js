const Koa = require('koa')
const KoaBody = require('koa-body')
const Cors = require('koa2-cors')
const logger = require('koa-logger')
const error = require('koa-json-error')
const loadRouter = require('./router')
const config = require('./config')
const db = require('./models')
const chalk = require('chalk')

const app = new Koa()
// TODO 学习这里的处理方式  app.context binding
const context = require('./utils/context')
Object.keys(context).forEach((key) => {
  app.context[key] = context[key]
})
const devMode = process.env.NODE_ENV === 'development'

// 解决跨域
app.use(Cors())
app.use(KoaBody())
app.use(logger())
app.use(
  error({
    format: (err) => {
      // 重新定义format
      return {
        code: err.status,
        msg: err.message,
        name: err.name,
        stack: err.stack,
      }
    },
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV !== 'development' ? rest : { stack, ...rest },
  })
)
// 加载路由
loadRouter(app)

app.listen(config.PORT, async () => {
  await db.sequelize.sync({ force: false })
  db.sequelize
    .authenticate()
    .then(() => {
      console.log(chalk.green('sequelize connect to database success'))
      console.log(chalk.green(`sever listen on http://127.0.0.1:${config.PORT}`))
    })
    .catch((err) => {
      console.error(chalk.red('Unable to connect to the database:', err))
    })
})
