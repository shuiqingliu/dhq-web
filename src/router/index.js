import Vue from 'vue'
import Router from 'vue-router'

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
  {
    path: '/store',
    component: Layout,
    redirect: '/store',
    meta: {title: '门店管理', icon: 'product'},
    children: [{
      path: 'storeInformation',
      name: 'storeInformation',
      component: () => import('@/views/store/storeInformation/index'),
      meta: {title: '门店信息', icon: 'product-list'}
    },{
      path:'storeEquipment',
      name:'storeEquipment',
      component: ()=>import('@/views/store/storeEquipment/index'),
      meta: {title: '门店设备', icon: 'product-add'}
    },{
      path:'updateStoreInfo',
      name:'updateStoreInfo',
      component: ()=>import('@/views/store/storeInformation/update'),
      meta: {title: '更新门店信息'},
      hidden: true
    }
    ,{
      path:'addStoreInfo',
      name:'addStoreInfo',
      component: ()=>import('@/views/store/storeInformation/add'),
      meta: {title: '更新门店信息'},
      hidden: true
    }]
  },
  {
    path: '/userAdmin',
    component: Layout,
    redirect: '/userAdmin',
    meta: {title: '用户管理', icon: 'product'},
    children: [{
      path: 'permissionAdmin',
      name: 'permissionAdmin',
      component: () => import('@/views/userAdmin/permission/index'),
      meta: {title: '用户管理', icon: 'product-list'}
    },{
      path:'roleAdmin',
      name:'roleAdmin',
      component: ()=>import('@/views/userAdmin/role/index'),
      meta: {title: '角色管理', icon: 'product-add'}
    },
    {
      path: 'updateUser',
      name: 'updateUser',
      component: ()=> import('@/views/userAdmin/permission/update'),
      meta: {title: '修改用户'},
      hidden: true
    },
    {
      path: 'addUser',
      name: 'addUser',
      component: ()=> import('@/views/userAdmin/permission/add'),
      meta: {title: '添加用户'},
      hidden: true
    },
    {
      path: 'updateRole',
      name: 'updateRole',
      component: ()=> import('@/views/userAdmin/role/update'),
      meta: {title: '修改角色权限'},
      hidden: true
    },
    {
      path: 'addRole',
      name: 'addRole',
      component: ()=> import('@/views/userAdmin/role/add'),
      meta: {title: '添加角色'},
      hidden: true
    }
  ]
  },
  {
    path: '/equipment',
    component: Layout,
    redirect: '/equipment',
    meta: {title: '设备管理', icon: 'product'},
    children: [{
      path: 'instance',
      name: 'instance',
      component: () => import('@/views/equipment/instance/index'),
      meta: {title: '设备实例管理', icon: 'product-add'}
    },
    {
      path: 'type',
      name: 'type',
      component: () => import('@/views/equipment/type/index'),
      meta: {title: '设备类型管理', icon: 'product-list'}
    },
    {
      path: 'addEquipmentType',
      name: 'addEquipmentType',
      component: () => import('@/views/equipment/type/add'),
      meta: {title: '添加设备类型', icon: 'product-list'},
      hidden: true
    },
    {
      path: 'updateEquipmentType',
      name: 'updateEquipmentType',
      component: () => import('@/views/equipment/type/update'),
      meta: {title: '修改设备类型', icon: 'product-list'},
      hidden: true
    }]
  },
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    name: 'pms',
    meta: {title: 'TEST', icon: 'product'},
    children: [{
      path: 'product',
      name: 'product',
      component: () => import('@/views/pms/product/index'),
      meta: {title: '门店', icon: 'product-list'}
    },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => import('@/views/pms/product/add'),
        meta: {title: '添加商品', icon: 'product-add'}
      },
      {
        path: 'updateProduct',
        name: 'updateProduct',
        component: () => import('@/views/pms/product/update'),
        meta: {title: '修改商品', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'productRecycle',
        name: 'productRecycle',
        component: () => import('@/views/pms/product/index'),
        meta: {title: '商品回收站', icon: 'product-recycle'},
        hidden: true
      },
      {
        path: 'productComment',
        name: 'productComment',
        component: () => import('@/views/pms/product/index'),
        meta: {title: '商品评价', icon: 'product-comment'},
        hidden: true
      },
      {
        path: 'productCate',
        name: 'productCate',
        component: () => import('@/views/pms/productCate/index'),
        meta: {title: '商品分类', icon: 'product-cate'}
      },
      {
        path: 'addProductCate',
        name: 'addProductCate',
        component: () => import('@/views/pms/productCate/add'),
        meta: {title: '添加商品分类'},
        hidden: true
      },
      {
        path: 'updateProductCate',
        name: 'updateProductCate',
        component: () => import('@/views/pms/productCate/update'),
        meta: {title: '修改商品分类'},
        hidden: true
      },
      {
        path: 'productAttr',
        name: 'productAttr',
        component: () => import('@/views/pms/productAttr/index'),
        meta: {title: '商品类型', icon: 'product-attr'}
      },
      {
        path: 'productAttrList',
        name: 'productAttrList',
        component: () => import('@/views/pms/productAttr/productAttrList'),
        meta: {title: '商品属性列表'},
        hidden: true
      },
      {
        path: 'addProductAttr',
        name: 'addProductAttr',
        component: () => import('@/views/pms/productAttr/addProductAttr'),
        meta: {title: '添加商品属性'},
        hidden: true
      },
      {
        path: 'updateProductAttr',
        name: 'updateProductAttr',
        component: () => import('@/views/pms/productAttr/updateProductAttr'),
        meta: {title: '修改商品属性'},
        hidden: true
      },
      {
        path: 'brand',
        name: 'brand',
        component: () => import('@/views/pms/brand/index'),
        meta: {title: '品牌管理', icon: 'product-brand'}
      },
      {
        path: 'addBrand',
        name: 'addBrand',
        component: () => import('@/views/pms/brand/add'),
        meta: {title: '添加品牌'},
        hidden: true
      },
      {
        path: 'updateBrand',
        name: 'updateBrand',
        component: () => import('@/views/pms/brand/update'),
        meta: {title: '编辑品牌'},
        hidden: true
      }
    ]
  },
  
  
  
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

