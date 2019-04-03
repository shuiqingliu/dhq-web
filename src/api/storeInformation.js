import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/brand/list',
    method:'get',
    params:params
  })
}
export function createStoreInfo(data) {
  return request({
    url:'/storeinfo/create',
    method:'post',
    data:data
  })
}
export function updateStoreInfo(data) {
  return request({
    url:'/storeinfo/update',
    method:'post',
    data:data
  })
}

export function deleteStoreInfo(id) {
  return request({
    url:'/storeinfo/deleteByID/'+id,
    method:'get',
  })
}

export function getBrand(id) {
  return request({
    url:'/brand/'+id,
    method:'get',
  })
}

export function updateBrand(id,data) {
  return request({
    url:'/brand/update/'+id,
    method:'post',
    data:data
  })
}

