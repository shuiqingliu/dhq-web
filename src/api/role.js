import request from '@/utils/request'
export function getRoles() {
    return request({
      url: '/role/list',
      method: 'get',
    })
  }