import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/msgcontent/list',
    method: 'get',
    params
  })
}

export function getList2(params) {
  return request({
    url: '/shopNews/getAllNewsOrderByTimeASC',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: '/msgcontent/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/shopNews/update ',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/msgcontent/delete',
    method: 'post',
    params:id
  })
}

export function search(params) {
  return request({
    url: '/shopNews/getSelectedShopNews',
    method: 'get',
    params
  })
}

export function upload(id) {
  return request({
    url: `/upload/pic`,
    method: 'post'
  })
}
