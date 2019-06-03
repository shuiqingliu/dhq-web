import request from '@/utils/request'

//课程数据
//1.课程课程
export function KCXL(params) {
    return request({
      url:'/OfflineCourseStatistic/courseAndCourse',
      method:'get',
      params:params
    })
}
//2.课程地区
export function KCDQ(params) {
    return request({
      url:'/OfflineCourseStatistic/courseAndRegion',
      method:'get',
      params:params
    })
}
//课程门店
export function KCMD(params) {
    return request({
      url:'/OfflineCourseStatistic/courseAndShop',
      method:'get',
      params:params
    })
}
//课程按月
export function KCY(params) {
  return request({
    url:'/OfflineCourseStatistic/getByYearWithMonth',
    method:'get',
    params:params
  })
}

//设备地区
export function SBDQ(params) {
    return request({
      url:'/deviceStatic/findDeviceNumberOfProvince',
      method:'get',
    params:params
    })
}
//设备前十
export function SBQS(params) {
    return request({
      url:'/deviceStatic/findTopTenDeviceTypeList',
      method:'get',
    params:params
    })
}
//设备门店
export function SBMD(params) {
    return request({
      url:'/deviceStatic/findDeviceNumberOfShop',
      method:'get',
    params:params
    })
}
//设备维修前十
export function SBWXQS(params) {
  return request({
    url:'/deviceMaintainStatic/findTopTenMaintainDeviceTypeList',
    method:'get',
    params:params
  })
}
//设备维修门店前十
export function SBWXMD(params) {
  return request({
    url:'/deviceMaintainStatic/findTopTenMaintainShopList',
    method:'get',
    params:params
  })
}

//财务地区
export function CWDQ(params) {
  return request({
    url:'/financialStatic/findOfflineProfitByProvinceList',
    method:'get',
    params:params
  })
}
//财务门店
export function CWMD(params) {
  return request({
    url:'/financialStatic/findOfflineProfitTopTenShop',
    method:'get',
    params:params
  })
}

//线上课前10
export function XSKQS(params) {
  return request({
    url:'/OnlineCourseStatistic/getOnlineCourseCountByCourse',
    method:'get',
    params:params
  })
}
//线上课月
export function XSKY(params) {
  return request({
    url:'/OnlineCourseStatistic/getCountByYear',
    method:'get',
    params:params
  })
}