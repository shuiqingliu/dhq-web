import request from '@/utils/request'
//获取设备申请类别
export function fetchList(params) {
  return request({
    url: '/shopCourse/getAllApplySpecialCourse',
    method: 'get',
    params: params
  })
}
//同意设备申请
export function agreeApply(params) {
  return request({
    url: '/shopCourse/applySpecialCourse',
    method: 'get',
    params:params
  })
}


//拒绝申请
export function rejectApply(id, remark) {
  return request({
    url: '/shopCourse/refuseSpecialApplyCourse?id=' + id + "&remark=" + remark,
    method: 'get',
  })
}