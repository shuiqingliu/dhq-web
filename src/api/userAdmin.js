import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/userAdmin/list',
    method:'get',
    params:params
  })
}
export function createUser(data) {
  return request({
    url:'/userAdmin/create',
    method:'post',
    data:data
  })
}

export function deleteUser(id) {
  return request({
    url:'/userAdmin/delete/'+id,
    method:'get',
  })
}

export function getUser(id) {
  return request({
    url:'/userAdmin/'+id,
    method:'get',
  })
}

export function updateUser(id,data) {
  return request({
    url:'/userAdmin/update/'+id,
    method:'post',
    data:data
  })
}

