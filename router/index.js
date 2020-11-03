const fs = require('fs')

module.exports = (app) => {
  // readdirSync()方法将返回一个包含“指定目录下所有文件名称”的数组对象
  fs.readdirSync(__dirname).forEach((file) => {
    if (!/\.js$/.test(file)) return
    if (file === 'index.js') return
    const route = require(`./${file}`)
    app.use(route.routes()).use(route.allowedMethods())
  })
}
