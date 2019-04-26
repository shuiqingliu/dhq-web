import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
// var a = [true,false,false]
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },
  // {
  //   path: '/store',
  //   component: Layout,
  //   redirect: '/store',
    
  //   meta: {title: '门店管理', icon: 'product'},
    
  //   children: [{
  //     path: 'storeInformation',
  //     name: 'storeInformation',
  //     component: () => import('@/views/store/storeInformation/index'),
  //     meta: {title: '门店信息', icon: 'product-list'}
  //   },{
  //     path:'storeEquipment',
  //     name:'storeEquipment',
  //     component: ()=>import('@/views/store/storeEquipment/index'),
  //     meta: {title: '门店设备', icon: 'product-add'}
  //   },{
  //     path:'updateStoreInfo',
  //     name:'updateStoreInfo',
  //     component: ()=>import('@/views/store/storeInformation/update'),
  //     meta: {title: '更新门店信息'},
  //     hidden: true
  //   }
  //   ,{
  //     path:'addStoreInfo',
  //     name:'addStoreInfo',
  //     component: ()=>import('@/views/store/storeInformation/add'),
  //     meta: {title: '添加门店信息'},
  //     hidden: true
  //   },{
  //     path:'getStoreInfoDetail',
  //     name:'getStoreInfoDetail',
  //     component: ()=>import('@/views/store/storeInformation/detail'),
  //     meta: {title: '获取门店详细信息'},
  //     hidden: true
  //   }]
  // },
  // {
  //   path: '/userAdmin',
  //   component: Layout,
  //   redirect: '/userAdmin',
  //   meta: {title: '用户管理', icon: 'product'},
  //   // hidden:a[1],
  //   children: [{
  //     path: 'permissionAdmin',
  //     name: 'permissionAdmin',
  //     component: () => import('@/views/userAdmin/permission/index'),
  //     meta: {title: '用户管理', icon: 'product-list'}
  //   },{
  //     path:'roleAdmin',
  //     name:'roleAdmin',
  //     component: ()=>import('@/views/userAdmin/role/index'),
  //     meta: {title: '角色管理', icon: 'product-add'}
  //   },
  //   {
  //     path: 'updateUser',
  //     name: 'updateUser',
  //     component: ()=> import('@/views/userAdmin/permission/update'),
  //     meta: {title: '修改用户'},
  //     hidden: true
  //   },
  //   {
  //     path: 'addUser',
  //     name: 'addUser',
  //     component: ()=> import('@/views/userAdmin/permission/add'),
  //     meta: {title: '添加用户'},
  //     hidden: true
  //   },
  //   {
  //     path: 'updateRole',
  //     name: 'updateRole',
  //     component: ()=> import('@/views/userAdmin/role/update'),
  //     meta: {title: '修改角色权限'},
  //     hidden: true
  //   },
  //   {
  //     path: 'addRole',
  //     name: 'addRole',
  //     component: ()=> import('@/views/userAdmin/role/add'),
  //     meta: {title: '添加角色'},
  //     hidden: true
  //   }
  // ]
  // },
  // {
  //   path: '/equipment',
  //   component: Layout,
  //   redirect: '/equipment',
  //   meta: {title: '设备管理', icon: 'product'},
  //   // hidden:a[2],
  //   children: [{
  //     path: 'instance',
  //     name: 'instance',
  //     component: () => import('@/views/equipment/instance/index'),
  //     meta: {title: '设备实例管理', icon: 'product-add'}
  //   },
  //   {
  //     path: 'type',
  //     name: 'type',
  //     component: () => import('@/views/equipment/type/index'),
  //     meta: {title: '设备类型管理', icon: 'product-list'}
  //   },
  //   {
  //     path: 'addEquipmentType',
  //     name: 'addEquipmentType',
  //     component: () => import('@/views/equipment/type/add'),
  //     meta: {title: '添加设备类型', icon: 'product-list'},
  //     hidden: true
  //   },
  //   {
  //     path: 'updateEquipmentType',
  //     name: 'updateEquipmentType',
  //     component: () => import('@/views/equipment/type/update'),
  //     meta: {title: '修改设备类型', icon: 'product-list'},
  //     hidden: true
  //   },
  //   {
  //     path: 'addEquipmentInstance',
  //     name: 'addEquipmentInstance',
  //     component: () => import('@/views/equipment/instance/add'),
  //     meta: {title: '添加设备实例', icon: 'product-list'},
  //     hidden: true
  //   },
  //   {
  //     path: 'updateEquipmentInstance',
  //     name: 'updateEquipmentInstance',
  //     component: () => import('@/views/equipment/instance/update'),
  //     meta: {title: '修改设备实例', icon: 'product-list'},
  //     hidden: true
  //   }]
  // },
  
  
  
  // {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

