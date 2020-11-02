const devMode = process.env.NODE_ENV === 'development'

const config = {
  PORT: 6060, // 服务启动端口
  ADMIN_GITHUB_LOGIN_NAME: 'giserman001', // github 登录的账户名 user
  GITHUB: {
    // github相关配置
    client_id: '',
    client_secret: '',
    access_token_url: '',
    fetch_user_url: '', // 用于 oauth2
    fetch_user: '', // fetch user url
  },
  EMAIL_NOTICE: {
    // detail: https://nodemailer.com/
    enable: true, // 开关
    transporterConfig: {
      host: 'smtp.163.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'guodadablog@163.com', // generated ethereal user
        pass: '123456', // generated ethereal password 授权码 而非 密码
      },
    },
    subject: '郭大大的博客 - 您的评论获得新的回复！', // 主题
    text: '您的评论获得新的回复！',
    WEB_HOST: 'http://127.0.0.1:3000', // email callback url
  }, // 邮件通知服务相关配置
  TOKEN: {
    // token配置
    secret: 'liu-test', // secret is very important!
    expiresIn: '720h', // token 有效期
  },
  DATABASE: {
    database: 'test',
    user: 'root',
    password: '123456',
    options: {
      host: 'localhost', // 连接的 host 地址
      dialect: 'mysql', // 连接到 mysql
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: false, // 默认不加时间戳
        freezeTableName: true, // 表名默认不加s
      },
      timezone: '+08:00',
    },
  }, //数据库相关配置
}
// 部署的环境变量设置
if (!devMode) {
  console.log('env production....')

  // ==== 配置数据库
  config.DATABASE = {
    ...config.DATABASE,
    database: '', // 数据库名
    user: '', // 账号
    password: '', // 密码
  }

  // 配置 github 授权
  config.GITHUB.client_id = ''
  config.GITHUB.client_secret = ''

  // ==== 配置 token 密钥
  config.TOKEN.secret = ''

  // ==== 配置邮箱

  // config.EMAIL_NOTICE.enable = true
  config.EMAIL_NOTICE.transporterConfig.auth = {
    user: 'guodadablog@163.com', // generated ethereal user
    pass: '123456XXX', // generated ethereal password 授权码 而非 密码
  }
  config.EMAIL_NOTICE.WEB_HOST = 'https://guodada.fun'
}

module.exports = config
