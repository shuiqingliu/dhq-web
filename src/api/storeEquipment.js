import request from '@/utils/request'
//获取门店设备列表。
export function fetchList(params) {
  return request({
    url:'/device/showAllShopDevice',
    method:'get',
    params:params
  })
}
//按条件查询门店设备信息
export function getStoreEquipmentById(params) {
  return request({
    url:'/device/searchByShopID',
    method:'get',
    params:params
  })
}


export function deleteStoreEquipment(params){
  return request({
    url:'/device/deleteByID',
    method:'get',
    params:params
  })
}