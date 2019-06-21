import request from '@/utils/request'
//获取设备列表
export function fetchList(params) {
  return request({
    url:'/deviceType/list',
    method:'get',
    params:params
  })
}
//创建设备
export function createEquipmentInstance(data) {
  return request({
    url:'/deviceType/add',
    method:'post',
    data:data
  })
}
//修改设备
export function updateEquipmentInstance(id,data) {
  return request({
    url:'/deviceType/update/' + id,
    method:'post',
    data:data
  })
}
//删除设备
export function deleteEquipmentInstance(id) {
  return request({
    url:'/deviceType/delete?id='+id,
    method:'get',
  })
}
//批量删除设备
export function batchDeleteEquipmentInstance(ids) {
  return request({
    url:'/deviceType/delete/batch?ids='+ids,
    method:'post',
  })
}
//根据id获取获取设备信息
export function getEquipmentInstance(id) {
  return request({
    url:'/deviceType/get?id='+id,
    method:'get'    
  })
}

//根据typeId获取获取设备信息
export function getEquipmentInstanceByTypeId(params) {
  return request({
    url:'/deviceType/getdeviceTypesByTypeId',
    method:'get',
    params:params
  })
}