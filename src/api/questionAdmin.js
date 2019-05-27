import request from '@/utils/request'
export function addSelect(data) {
    return request({
    url:'/testquestionmanagement/createchoice',
    method:'post',
    data:data
    })
}

export function addSelect2(data) {
    return request({
    url:'/testquestionmanagement/updatechoice',
    method:'post',
    data:data
    })
}

export function addTiankong(data) {
    return request({
        url:'/testquestionmanagement/createfill',
        method:'post',
        data:data
    })
}

export function addTiankong2(data) {
    return request({
        url:'/testquestionmanagement/updatefill',
        method:'post',
        data:data
    })
}

export function addJianda(data) {
    return request({
        url:'/testquestionmanagement/createanswer',
        method:'post',
        data:data
    })
}
export function addJianda2(data) {
    return request({
        url:'/testquestionmanagement/updateanswer',
        method:'post',
        data:data
    })
}

//获得选择题

export function fetchList1(params){
    return request({
        url:'/testquestionmanagement/listsomechoice',
        method: 'get',
        params: params
    })
}
//获得填空题
export function fetchList2(params){
    return request({
        url:'/testquestionmanagement/listsomefill',
        method: 'get',
        params: params
    })
}
//获得简答题
export function fetchList3(params){
    return request({
        url:'/testquestionmanagement/listsomeanswer',
        method: 'get',
        params: params
    })
}

//获取选择
export function getQuestion1(id){
    return request({
        url: '/testquestionmanagement/listChoiceById'+id,
        method: 'get'
    })
}

//获取填空

export function getQuestion2(id){
    return request({
        url: '/testquestionmanagement/listFillById'+id,
        method: 'get'
    })
}

//获取简答
export function getQuestion3(id){
    return request({
        url: '/testquestionmanagement/listAnswerById'+id,
        method: 'get'
    })
}

//删除选择

export function del1(id){
    return request({
        url: '/testquestionmanagement/deletechoice/{id}',
        method: 'get',
        params: {choiceid:id}
    })
}
//删除填空
export function del2(id){
    return request({
        url: '/testquestionmanagement/deletefill/{id}',
        method: 'get',
        params: {fillid:id}
    })
}

//删除简答
export function del3(id){
    return request({
        url: '/testquestionmanagement/deleteanswer/{id}',
        method: 'get',
        params: {answerid:id}
    })
}
