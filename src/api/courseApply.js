import request from '@/utils/request'
//获取设备申请类别
export function fetchList(params) {
  return request({
    url: '/shopCourse/getAllApplyCourse',
    method: 'get',
    params: params
  })
}
//同意设备申请
export function agreeApply(id,remark) {
  return request({
    url: '/shopCourse/applyCourse?id=' + id + "&xntResponseOpinion=" + remark,
    method: 'get',
  })
}


//拒绝申请
export function rejectApply(id, remark) {
  return request({
    url: '/shopCourse/refuseApplyCourse?id=' + id + "&xntResponseOpinion=" + remark,
    method: 'get',
  })
}