import request from '@/utils/request'
//获取设备列表
export function fetchList(params) {
  return request({
    url:'/device2/list',
    method:'get',
    params:params
  })
}
//创建
export function createEquipmentDetail(data) {
  return request({
    url:'/device2/add',
    method:'post',
    data:data
  })
}
//修改
export function updateEquipmentDetail(id,data) {
  return request({
    url:'/device2/update/' + id,
    method:'post',
    data:data
  })
}
//删除
export function deleteEquipmentDetail(id) {
  return request({
    url:'/device2/delete?id='+id,
    method:'get',
  })
}
//根据id获取信息
export function getEquipmentDetail(id) {
  return request({
    url:'/device2/getByTypeId?id='+id,
    method:'get'
  })
}
