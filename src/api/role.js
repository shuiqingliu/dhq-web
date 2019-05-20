<<<<<<< HEAD
import request from '@/utils/request'
export function getRoles() {
    return request({
      url: '/role/list2',
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
    url: '/role/permission/add',
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

export function createRole(data) {
  return request({
    url:'/role/create',
    method:'post',
    data:data
  })
}

export function updateRole(id,data) {
  return request({
    url:'/role/update/'+id,
    method:'post',
    data:data
  })
}
export function getRole(id) {
  return request({
    url:'/role/'+id,
    method:'get',
  })
}

export function deleteRole(params) {
  return request({
    url:'/role/delete',
    method:'post',
    params:params
  })
}

//获取树形权限列表
export function getPermisisonTree(){
  return request({
    url: '/permission/treelist',
    method: 'get'
  })
}

export function getRolePermission(id){
  return request({
    url: '/role/permission/' + id,
    method: 'get'
  })
}
// export function addUserRole(params){
//   return request({
//     url: '/user/role/update'
//   })
// }
=======
import request from '@/utils/request'
export function getRoles() {
    return request({
      url: '/role/list2',
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

export function createRole(data) {
  return request({
    url:'/role/create',
    method:'post',
    data:data
  })
}

export function updateRole(id,data) {
  return request({
    url:'/role/update/'+id,
    method:'post',
    data:data
  })
}
export function getRole(id) {
  return request({
    url:'/role/'+id,
    method:'get',
  })
}

export function deleteRole(params) {
  return request({
    url:'/role/delete',
    method:'post',
    params:params
  })
}
>>>>>>> feature_test
