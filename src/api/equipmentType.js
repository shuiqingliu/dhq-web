import request from '@/utils/request'
//获取设备类型列表
export function fetchList(params) {
  return request({
    url:'/DeviceClass/list',
    method:'get',
    params:params
  })
}
export function fetchListTree() {
  return request({
    url:'/DeviceClass/listTree',
    method:'get',
  })
}

//查询设备类型列表
export function queryDeviceClass(data){
  return request({
      url:'/DeviceClass/list',
      method:'get',
      data:data
  }
  )
}

//创建设备类型
export function createEquipmentType(data) {
  return request({
    url:'/DeviceClass/add',
    method:'post',
    data:data
  })
}
//修改设备类型
export function updateEquipmentType(id,data) {
  return request({
    url:'/DeviceClass/update/' + id,
    method:'post',
    data:data
  })
}
//删除设备类型
export function deleteEquipmentType(id) {
  return request({
    url:'/DeviceClass/delete/'+id,
    method:'get',
  })
}

//根据设备类别批量删除
export function batchDeleteEquipmentClass(params) {
  return request({
    url:'/DeviceClass/delete/batch',
    method:'get',
    params:params
  })
}

//批量删除设备类型
export function batchDeleteEquipmentType(ids) {
  return request({
    url:'/DeviceClass/delete/batch?ids=' + ids,
    method:'get'
  })
}
//根据id获取获取门店信息
export function getEquipmentType(id) {
  return request({
    url:'/DeviceClass/get?id='+id,
    method:'get',
  })
}