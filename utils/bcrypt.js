const config = require('../config')
const bcrypt = require('bcrypt')

/**
 * @function - 密码加密
 * @param {string} password - 密码
 */
exports.encrypt = (password) => {
  return new Promise((resolve, reject) => {
    try {
      const salt = bcrypt.genSaltSync(config.SALT_WORK_FACTOR)
      const hash = bcrypt.hashSync(password, salt)
      resolve(hash)
    } catch (error) {
      reject(error)
    }
  })
  // return new Promise((resolve, reject) => {
  //   bcrypt.genSalt(config.SALT_WORK_FACTOR, (err, salt) => {
  //     if (err) reject(password)
  //     bcrypt.hash(password, salt, function (err, hash) {
  //       if (err) resolve(password)
  //       resolve(hash)
  //     })
  //   })
  // })
}

/**
 * @func comparePassword - 密码校验
 * @param {String} _password - 需要校验的密码
 * @param {String} hash - 加密后的密码
 */
exports.comparePassword = (_password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(_password, hash, function (err, isMatch) {
      if (err) reject(err)
      else resolve(isMatch)
    })
  })
}
