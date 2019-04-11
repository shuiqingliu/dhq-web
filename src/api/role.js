import request from '@/utils/request'
export function getRoles() {
    return request({
      url: '/role/list',
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
