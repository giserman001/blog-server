const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { DATABASE } = require('../config')
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(DATABASE.database, DATABASE.user, DATABASE.password, {
  ...DATABASE.options,
  logging: function (msg) {
    console.log(`${chalk.yellow('SQL日志=>')}${msg}`)
  },
})
const db = {}
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    // const model = sequelize.import(path.join(__dirname, file)) // 老版本写法(已过时)
    const model = require(path.join(__dirname, file))(sequelize, Sequelize)
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

module.exports = db
