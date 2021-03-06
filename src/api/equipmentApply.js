import request from '@/utils/request'
//获取设备申请列别
export function fetchList(params) {
  return request({
    url: '/deviceApply/selectByStatus',
    method: 'get',
    params: params
  })
}

//拒绝申请
export function rejectDeviceApply(applyID, data) {
  return request({
    url: '/deviceApply/reject?applyID=' + applyID,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//批量分配设备(同意设备的申请)
export function batchAllocateDevice(params) {
  return request({
    url: '/deviceApply/agree',
    method: 'get',
    params: params
  })
}
//根据设备类型ID查看未分配的设备。
export function findDevicesWithType(params) {
  return request({
    url: '/deviceApply/findDevicesWithType',
    method: 'get',
    params: params
  })
}

// //创建设备
// export function createEquipmentInstance(data) {
//   return request({
//     url: '/device/add',
//     method: 'post',
//     data: data
//   })
// }
// //修改设备
// export function updateEquipmentInstance(id, data) {
//   return request({
//     url: '/device/update/' + id,
//     method: 'post',
//     data: data
//   })
// }
// //删除设备
// export function deleteEquipmentInstance(id) {
//   return request({
//     url: '/device/delete?id=' + id,
//     method: 'get',
//   })
// }
// //批量删除设备
// export function batchDeleteEquipmentInstance(ids) {
//   return request({
//     url: '/device/delete/batch?ids=' + ids,
//     method: 'post',
//   })
// }

// //获取一级列表
// export function getFirstCategory() {
//   return request({
//     url: '/device/getFirstCategory',
//     method: 'get'
//   })
// }
// //获取二级列表
// export function getSecondCategory() {
//   return request({
//     url: '/device/getSecondCategory',
//     method: 'get'
//   })
// }

// //获取三级列表
// export function getThirdCategory() {
//   return request({
//     url: '/device/getThirdCategory',
//     method: 'get'
//   })
// }