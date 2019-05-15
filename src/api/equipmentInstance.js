import request from '@/utils/request'
//获取设备列表
export function fetchList(params) {
  return request({
    url:'/device/list',
    method:'get',
    params:params
  })
}
//创建设备
export function createEquipmentInstance(data) {
  return request({
    url:'/device/add',
    method:'post',
    data:data
  })
}
//修改设备
export function updateEquipmentInstance(id,data) {
  return request({
    url:'/device/update/' + id,
    method:'post',
    data:data
  })
}
//删除设备
export function deleteEquipmentInstance(id) {
  return request({
    url:'/device/delete?id='+id,
    method:'get',
  })
}
//批量删除设备
export function batchDeleteEquipmentInstance(ids) {
  return request({
    url:'/device/delete/batch?ids='+ids,
    method:'post',
  })
}
//根据id获取获取设备信息
export function getEquipmentInstance(id) {
  return request({
    url:'/device/get?id='+id,
    method:'get'
  })
}

//根据typeId获取获取设备信息
export function getEquipmentInstanceByTypeId(params) {
  return request({
    url:'/device/getDevicesByTypeId',
    method:'get',
    params:params
  })
}
//获取一级列表
export function getFirstCategory(){
  return request({
    url:'/device/getFirstCategory',
    method:'get'
  })
}
//获取二级列表
export function getSecondCategory(){
  return request({
    url:'/device/getSecondCategory',
    method:'get'
  })
}

//获取三级列表
export function getThirdCategory(){
  return request({
    url:'/device/getThirdCategory',
    method:'get'
  })
}