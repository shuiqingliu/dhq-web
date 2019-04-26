import request from '@/utils/request'
//获取设备类型列表
export function fetchList(params) {
  return request({
    url:'/deviceType/list',
    method:'get',
    params:params
  })
}
//创建设备类型
export function createEquipmentType(data) {
  return request({
    url:'/deviceType/add',
    method:'post',
    data:data
  })
}
//修改设备类型
export function updateEquipmentType(id,data) {
  return request({
    url:'/deviceType/update/' + id,
    method:'post',
    data:data
  })
}
//删除设备类型
export function deleteEquipmentType(id) {
  return request({
    url:'/deviceType/delete'+id,
    method:'get',
  })
}
//批量删除设备类型
export function batchDeleteEquipmentType(ids) {
  return request({
    url:'/deviceType/delete/batch?ids=' + ids,
    method:'get'
  })
}
//根据id获取获取门店信息
export function getEquipmentType(id) {
  return request({
    url:'/deviceType/get?id='+id,
    method:'get',
  })
}