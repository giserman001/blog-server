/**
 * role = 1 admin 有权限
 */

const role_auth_1 = [
  { regexp: /\/article/, required: 'get, post, put, delete' }, // 普通用户 禁止导出或者修改或者删除、添加文章
  { regexp: /\/discuss/, required: 'delete, post' }, // 普通用户 禁止删除评论
  { regexp: /\/user/, required: 'get, put, delete' }, // 普通用户 禁止获取用户、修改用户、以及删除用户
]

/**
 * role = 2 普通用户 有权限
 */

const role_auth_2 = [{ regexp: /\/discuss/, require: 'post' }]

// 所有需要token验证的路由
const all_auth = [...role_auth_1, ...role_auth_2]

const checkAuth = (ctx, role) => {
  const { method, url } = ctx
  const isAll = utils(all_auth, method, url)
  if (isAll) {
    const role_auth = +role === 1 ? role_auth_1 : role_auth_2
    const isCur = utils(role_auth, method, url)
    if (isCur) {
      return true
    } else {
      return false
    }
  }
  return true
}

function utils(role_auth_list, method, url) {
  return role_auth_list.some((v) => {
    return v.regexp.test(url) && (v.required === 'all' || v.required.toUpperCase().includes(method))
  })
}

module.exports = {
  all_auth,
  checkAuth,
}
