import request from '@/utils/request'
export function getRoles() {
    return request({
      url: '/role/list',
      method: 'get',
    })
}

export function getPermissions() {
  return request({
    url: '/permission/list',
    method: 'get',
  })
}

export function getUserRole(id) {
  return request({
    url: '/user/role/' + id,
    method: 'get',
  })
}

export function updateUserRole(params) {
  return request({
    url: '/user/role/update',
    method: 'post',
    params:params
  })
}

export function updateRolePermission(params) {
  return request({
    url: '/role/permission/update',
    method: 'post',
    params:params
  })
}
export function fetchRole(params) {
  return request({
    url:'/role/list',
    method:'get',
    params:params
  })
}

