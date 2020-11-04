module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    let status = e.status || 500
    let message = e.message || '服务器错误'
    this.body = {
      status: status,
      message: message,
    }
    // 触发 koa 统一错误事件，可以打印出详细的错误堆栈 log
    ctx.app.emit('error', e, this)
  }
}

// app.on('error', (err, ctx) => {
//   console.log(err, ctx, '触发错误了')
// })
