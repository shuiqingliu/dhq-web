import request from '@/utils/request'
var v = '/user'
export function login(username, password) {
  return request({
    url: v+'/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: v+'/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: v+'/logout',
    method: 'post'
  })
}
