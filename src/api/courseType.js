import request from '@/utils/request'
//获取课程类型列表
export function fetchList(params) {
  return request({
    url:'/courseType/list',
    method:'get',
    params:params
  })
}
//创建课程类型
export function createCourseType(data) {
  return request({
    url:'/courseType/add',
    method:'post',
    data:data
  })
}
//修改课程类型
export function updateCourseType(id,data) {
  return request({
    url:'/courseType/update/' + id,
    method:'post',
    data:data
  })
}
//删除课程类型
export function deleteCourseType(id) {
  return request({
    url:'/courseType/delete?id=' + id,
    method:'post',
  })
}
//批量删除课程类型
export function batchDeleteCourseType(ids) {
  return request({
    url:'/courseType/delete/batch?ids='+ids,
    method:'post',
  })
}
//根据id获取获取课程类型
export function getCourseType(id) {
  return request({
    url:'/courseType/get?id='+id,
    method:'get',
  })
}
