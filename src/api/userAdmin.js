import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/user/list',
    method:'get',
    params:params
  })
}
export function createUser(data) {
  return request({
    url:'/user/register',
    method:'post',
    data:data
  })
}

export function deleteUser(id) {
  return request({
    url:'/user/delete/'+id,
    method:'post',
  })
}

export function getUser(id) {
  return request({
    url:'/user/'+id,
    method:'get',
  })
}

export function updateUser(id,data) {
  return request({
    url:'/user/update/'+id,
    method:'post',
    data:data
  })
}

//根据机构id获取用户列表

export function getUserByOrgnization(params){
  return request({
    url: '/user/listByOrganizationid',
    method: 'get',
    params: params
  })
}

//修改用户密码
export function changePassword(data){
  return request({
    url:'/user/changePassword',
    method:'post',
    data:data
  })
}
