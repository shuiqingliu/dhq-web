import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    // redirect: '/home',
    name: 'Dashboard',
    // alwaysShow: true,
    // hidden: true,
    meta: {
      title: '首页',
      icon: 'dashboard'
    },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  // 系统管理 system management
  {
    path: '/systemm',
    component: Layout,
    redirect: '/system',
    name: 'SystemManagement',
    // alwaysShow: true,
    // hidden: true,
    meta: {
      title: '系统管理',
      icon: 'person'
    },
    children: [
      // 角色管理
      {
        path: 'role',
        component: () => import('@/views/systemm/role'),
        name: 'Role',
        meta: { title: '角色管理' }
      },
      // 用户管理
      {
        path: 'user',
        component: () => import('@/views/systemm/user'),
        name: 'User',
        meta: { title: '用户管理' }
      },
      // 权限管理
      {
        path: 'permission',
        component: () => import('@/views/systemm/permission'),
        name: 'Permission',
        meta: { title: '权限管理' }
      },
      // 机构管理
      {
        path: 'institution',
        component: () => import('@/views/systemm/institution'),
        name: 'Institution',
        meta: { title: '机构管理' }
      },
      // 日志管理
      {
        path: 'log',
        component: () => import('@/views/systemm/log'),
        name: 'Log',
        meta: { title: '日志管理' }
      }
    ]
  },
  // 门店管理 store management
  {
    path: '/storem',
    component: Layout,
    redirect: '/storem',
    name: 'StoreManagment',
    // alwaysShow: true,
    // hidden: true,
    meta: {
      // title: 'PersonnelManagement',
      title: '门店管理',
      icon: 'store'
    },
    children: [
      // 门店基本信息管理
      {
        path: 'basic-info',
        component: () => import('@/views/storem/basic-info'),
        name: 'StoreBasicInformation',
        meta: { title: '信息管理', icon: 'basic-info' }
      },
      // 门店设备管理
      {
        path: 'equipment',
        component: () => import('@/views/storem/equipment'),
        name: 'StoreEquipment',
        meta: { title: '设备管理', icon: 'equipment' }
      },
      // 门店课程管理
      {
        path: 'course',
        component: () => import('@/views/storem/course'),
        name: 'StoreCourseManagement',
        meta: { title: '课程管理', icon: 'course' }
      },
      // 门店财务管理
      {
        path: 'finance',
        component: () => import('@/views/storem/finance'),
        name: 'StoreFinanceManagement',
        meta: { title: '统计管理', icon: 'finance' }
      },
      // 门店维修管理
      {
        path: 'repair',
        component: () => import('@/views/storem/repair'),
        name: 'StoreRepairManagement',
        meta: { title: '维修管理', icon: 'repair' }
      }
    ]
  },
  // 财务管理 financial management
  {
    path: '/financialm',
    component: Layout,
    redirect: '/financialm',
    name: 'FinancialManagement',
    alwaysShow: true,
    // hidden: true,
    meta: {
      title: '财务管理',
      icon: 'financial'
    },
    children: [
      // 财务信息 financial information
      {
        path: 'financial-info',
        component: () => import('@/views/financialm/financial-info'),
        name: 'FinancialInformation',
        meta: { title: '财务信息', icon: 'financial-info' }
      }
    ]
  },
  // 新闻管理 news management
  {
    path: '/newsm',
    component: Layout,
    redirect: '/newsm',
    name: 'NewsManagement',
    alwaysShow: true,
    // hidden: true,
    meta: {
      title: '内容管理',
      icon: 'news'
    },
    children: [
      // 新闻列表 news list
      {
        path: 'news-list',
        component: () => import('@/views/newsm/news-list'),
        name: 'NewsList',
        meta: { title: '新闻列表', icon: 'news-list' }
      }
    ]
  },
  // 设备管理 equipment management
  {
    path: '/equipmentm',
    component: Layout,
    redirect: '/equipmentm',
    name: 'EquipmentManagement',
    // alwaysShow: true,
    // hidden: true,
    meta: {
      title: '设备管理',
      icon: 'equipment'
    },
    children: [
      // 查看设备 equipment check
      {
        path: 'equipment-check',
        component: () => import('@/views/equipmentm/equipment-check'),
        name: 'EquipmentCheck',
        meta: { title: '查看设备', icon: 'equipment-check' }
      },
      // 申请设备
      {
        path: 'equipment-apply',
        component: () => import('@/views/equipmentm/equipment-apply'),
        name: 'EquipmentApply',
        meta: { title: '申请设备', icon: 'equipment-apply' }
      },
      // 查看申请
      {
        path: 'apply-check',
        component: () => import('@/views/equipmentm/apply-check'),
        name: 'ApplyCheck',
        meta: { title: '查看申请', icon: 'apply-check' }
      },
      // 查看报修
      {
        path: 'repair-check',
        component: () => import('@/views/equipmentm/repair-check'),
        name: 'RepairCheck',
        meta: { title: '查看报修', icon: 'repair-check' }
      }
    ]
  },
  // 课程管理 course management
  {
    path: '/coursem',
    component: Layout,
    redirect: '/coursem',
    name: 'CourseManagement',
    // alwaysShow: true,
    // hidden: true,
    meta: {
      title: '课程管理',
      icon: 'course'
    },
    children: [
      // 课程信息
      {
        path: 'course-info',
        component: () => import('@/views/coursem/course-info'),
        name: 'CourseInfo',
        meta: { title: '课程信息', icon: 'course-info' }
      },
      // 申请课程
      {
        path: 'course-apply',
        component: () => import('@/views/coursem/course-apply'),
        name: 'CourseApply',
        meta: { title: '申请课程', icon: 'course-apply' }
      },
      // 申请新课
      {
        path: 'new-course-apply',
        component: () => import('@/views/coursem/new-course-apply'),
        name: 'NewCourseApply',
        meta: { title: '申请新课', icon: 'new-course-apply' }
      },
      // 上课记录
      {
        path: 'course-record',
        component: () => import('@/views/coursem/course-record'),
        name: 'CourseRecord',
        meta: { title: '上课记录', icon: 'course-record' }
      },
      // 审核申请
      {
        path: 'apply-audit',
        component: () => import('@/views/coursem/apply-audit'),
        name: 'ApplyAudit',
        meta: { title: '审核申请', icon: 'apply-audit' }
      }
    ]
  },
  // 评测管理 evaluation management
  {
    path: '/evaluationm',
    component: Layout,
    redirect: '/evaluationm',
    name: 'EvaluationManagement',
    // alwaysShow: true,
    // hidden: true,
    meta: {
      title: '评测管理',
      icon: 'evaluation'
    },
    children: [
      // 学生评测
      {
        path: 'student-eval',
        component: () => import('@/views/evaluationm/student-eval'),
        name: 'StudentEvalution',
        meta: { title: '学生评测', icon: 'class-info' }
      },
      // 评测报告
      {
        path: 'evaluation-report',
        component: () => import('@/views/evaluationm/evaluation-report'),
        name: 'EvaluationReport',
        meta: { title: '评测报告' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
