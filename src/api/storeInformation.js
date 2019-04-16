import request from '@/utils/request'
//获取门店信息列表
export function fetchList(params) {
  return request({
    url:'/shopInfo/searchByMultiCondition',
    method:'get',
    params:params
  })
}
//创建门店信息
export function createStoreInfo(data) {
  return request({
    url:'/shopInfo/create',
    method:'post',
    data:data
  })
}
//修改门店信息
export function updateStoreInfo(data) {
  return request({
    url:'/shopInfo/update',
    method:'post',
    data:data
  })
}
//删除门店信息
export function deleteStoreInfo(id) {
  return request({
    url:'/shopInfo/deleteByID?shopID='+id,
    method:'get',
  })
}
//根据id获取获取门店信息
export function getStoreInfoById(id) {
  return request({
    url:'/shopInfo/searchShopByID?id='+id,
    method:'get',
  })
}