import request from '@/utils/request'
export function addSelect(data) {
    return request({
    url:'/testquestionmanagement/createchoice',
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

export function addJianda(data) {
    return request({
        url:'/testquestionmanagement/createanswer',
        method:'post',
        data:data
    })
}