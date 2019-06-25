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
//批量删除门店信息
export function batchDeleteStoreInfo(ids) {
  return request({
    url:'/shopInfo/deleteByExamples?ids='+ids,
    method:'get'
  })
}

//根据id获取获取门店信息
export function getStoreInfoById(id) {
  return request({
    url:'/shopInfo/searchShopByID?id='+id,
    method:'get',
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

//获取图片
export function getImg(id) {
  return request({
    url:'/shopInfo/showImage?id='+id,
    method:'get',
  })
}