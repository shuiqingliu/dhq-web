import request from '@/utils/request'
//获取课程列表
export function fetchList(params) {
  return request({
    url:'/courseType/list',
    method:'get',
    params:params
  })
}
//创建课程
export function createCourseInstance(data) {
  return request({
    url:'/courseType/add',
    method:'post',
    data:data
  })
}
//修改课程
export function updateCourseInstance(id,data) {
  return request({
    url:'/courseType/update/' + id,
    method:'post',
    data:data
  })
}
//删除课程
export function deleteCourseInstance(id) {
  return request({
    url:'/courseType/delete?id='+id,
    method:'get',
  })
}
//批量删除课程
export function batchDeleteCourseInstance(ids) {
  return request({
    url:'/courseType/delete/batch?ids='+ids,
    method:'post',
  })
}
//根据id获取获取课程信息
export function getCourseInstance(id) {
  return request({
    url:'/courseType/get?id='+id,
    method:'get'
  })
}

//更新状态
export function updateStatus(id,params) {
  return request({
    url:'/courseType/update/status/'+id,
    method:'post',
    params:params
  })
}

//获取一级列表
export function getFirstCategory(){
  return request({
    url:'/courseType/getFirstType',
    method:'get'
  })
}
//获取二级列表
export function getSecondCategory(){
  return request({
    url:'/courseType/getSecondType',
    method:'get'
  })
}

//获取三级列表
export function getThirdCategory(){
  return request({
    url:'/courseType/getThirdType',
    method:'get'
  })
}