import request from '@/utils/request'

//课程数据
//1.课程课程
export function KCXL(data) {
    return request({
      url:'/OfflineCourseStatistic/courseAndCourse',
      method:'post',
      data:data
    })
}
//2.课程地区
export function KCDQ(data) {
    return request({
      url:'/OfflineCourseStatistic/courseAndRegion',
      method:'post',
      data:data
    })
}
//课程门店
export function KCMD(data) {
    return request({
      url:'/OfflineCourseStatistic/courseAndShop',
      method:'post',
      data:data
    })
}

//设备地区
export function SBDQ(data) {
    return request({
      url:'/deviceStatic/findDeviceNumberOfProvince',
      method:'post',
      data:data
    })
}
//设备前十
export function SBQS(data) {
    return request({
      url:'/deviceStatic/findTopTenDeviceTypeList',
      method:'post',
      data:data
    })
}
//设备门店
export function SBMD(data) {
    return request({
      url:'/deviceStatic/findDeviceNumberOfShop',
      method:'post',
      data:data
    })
}