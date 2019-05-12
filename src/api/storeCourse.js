import request from '@/utils/request'
//获取门店设备列表。
export function fetchList(params) {
  return request({
    url:'/shopCourse/getAll',
    method:'get',
    params:params
  })
}


//获取已开设学能通门店的省份;
export function getProvince() {
  return request({
    url:'/shopCourse/getProvince',
    method:'get',
  })
}

//根据省份获取城市;
export function getCity(province) {
  return request({
    url:'/shopCourse/getCity?province='+province,
    method:'get',
  })
}

//获取曲线;
export function getDistrict(params) {
  return request({
    url:'/shopCourse/getDistinct',
    method:'get',
    params:params
  })
}

//获取门店名;
export function getShopName(params) {
  return request({
    url:'/shopCourse/getShopNameByDistinct',
    method:'get',
    params:params
  })
}

//获取门店Id
export function getShopId(params){
  return request({
    url:'/shopCourse/getShopId',
    method:'get',
    params:params
  })
}

export function addShopCourse(params) {
  return request({
    url:'/shopCourse/add',
    method:'get',
    params:params
  })
}

export function deleteStoreCourse(id) {
  return request({
    url:'/shopCourse/delete/'+id,
    method:'get',
  })
}
