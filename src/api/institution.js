import request from '@/utils/request'
//获取所有机构
export function getInstitutions() {
    return request({
      url:'/HeadOrganization/treelist',
      method:'get',
      
    })
  }
// 添加机构

export function addInstitution(data){
    return request({
        url: '/HeadOrganization/create',
        method: 'post',
        data: data
    })
}
// 修改机构
export function changeInstitution(data){
    return request({
        url: '/HeadOrganization/update'+data.id,
        method: 'post',
        data: data.headOrganizationParam
    })
}
//删除机构
export function delInstitution(data){
    return request({
        url: '/HeadOrganization/deleteById',
        dataType:'JSON',
        method: 'get',
        // beforeSend : function(req) {
        //     req.setRequestHeader('Authorization', auth);
        //     req.setRequestHeader('Content-Type', 'application/json');  ///加这一行解决问题
        // },
        params:data
    })
}

//获取机构信息

export function show(id){
    return request({
        url: '/HeadOrganization/listOrganizationById' + id,
        method: 'get'
    })
}

//获取所有机构
export function getOrganizations(){
    return request({
        url: '/HeadOrganization/listTreeOrganization',
        method: 'get'
    })
}