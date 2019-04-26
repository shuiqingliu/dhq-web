import request from '@/utils/request'
//获取门店设备列表。
export function fetchList(params) {
  return request({
    url:'/shopDevice/showAllShopDevice',
    method:'get',
    params:params
  })
}
//按条件查询门店设备信息
export function getStoreEquipmentById(params) {
  return request({
    url:'/shopDevice/searchByShopID',
    method:'get',
    params:params
  })
}

//修改门店信息
export function updateStoreInfo(id,data) {
  return request({
    url:'/shopInfo/update'+id,
    method:'post',
    data:data
  })
}
//删除门店信息
export function deleteStoreInfo(data) {
  return request({
    url:'/shopInfo/deleteByID',
    method:'post',
    data:data,
    headers:{
      'Content-Type':'application/json'
    }
  })
}
//根据id获取获取门店信息
export function getStoreInfoById(id) {
  return request({
    url:'/shopInfo/searchShopByID?id='+id,
    method:'get',
  })
}