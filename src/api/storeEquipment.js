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

//根据地理信息获取门店名
export function getShopNameByLocation(params) {
  return request({
    url:'/OrderOffline/listShopsOfRegion',
    method:'get',
    params:params
  })
}
//返回所有的设备名


export function getDeviceName() {
  return request({
    url:'/device/showDeviceNames',
    method:'get',
  })
}