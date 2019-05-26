import request from '@/utils/request'
//获取设备类型列表
export function fetchList(params) {
  return request({
    url:'/deviceMaintain/maintainInfoQuery',
    method:'get',
    params:params
  })
}