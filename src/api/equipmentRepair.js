import request from '@/utils/request'
//获取设备类型列表
export function fetchList(params) {
  return request({
    url:'/deviceMaintain/maintainInfoQuery',
    method:'get',
    params:params
  })
}
// GET /deviceMaintain/getMaintainManager
//获取维修人员列表
export function getMaintainManagerList(params) {
  return request({
    url:'/deviceMaintain/getMaintainManager',
    method:'get',
    params:params
  })
}


export function agreeDeviceMaintainApply(id,maintainManagerId) {
  return request({
    url:'/deviceMaintain/agreeDeviceMaintainApply?id='+id+"&maintainManagerId="+maintainManagerId,
    method:'get',
  })
}

export function refuseApply(id,mark) {
  return request({
    url:'/deviceMaintain/refuseApply?id='+id +'&mark='+mark,
    method:'get',
  })
}


//换货
export function agreeDeviceChangingApply(id) {
  return request({
    url:'/deviceMaintain/agreeDeviceChangingApply?id='+id,
    method:'get',
  })
}


export function maintainDevice(params) {
  return request({
    url:'/deviceMaintain/maintainDevice',
    method:'get',
    params:params,
    headers:{
      'Content-Type':'text/plain;charset=UTF-8'
    }
  })
}

export function agreeDeviceChangedApply(params) {
  return request({
    url:'/deviceMaintain/agreeDeviceChangedApply',
    method:'get',
    params:params
  })
}