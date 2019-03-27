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
  // 人员管理 personnel management
  {
    path: '/personnelm',
    component: Layout,
    redirect: '/personnelm',
    name: 'PersonnelManagement',
    // alwaysShow: true,
    // hidden: true,
    meta: {
      title: '人员管理',
      icon: 'person'
    },
    children: [
      // 工作人员管理
      {
        path: 'stuff',
        component: () => import('@/views/personnelm/stuff'),
        name: 'Stuff',
        meta: { title: '工作人员管理' }
      },
      // 门店客户管理
      {
        path: 'client',
        component: () => import('@/views/personnelm/client'),
        name: 'Client',
        meta: { title: '门店客户管理' }
      }
    ]
  },
  // 反馈管理 feedback management
  {
    path: '/feedbackm',
    component: Layout,
    redirect: '/feedbackm',
    name: 'FeedbackManagement',
    // alwaysShow: true,
    // hidden: true,
    meta: {
      // title: 'PersonnelManagement',
      title: '反馈管理',
      icon: 'feedback'
    },
    children: [
      // 教师评价 teacher evaluation
      {
        path: 'teacher-eval',
        component: () => import('@/views/feedbackm/teacher-eval'),
        name: 'TeacherEvaluation',
        meta: { title: '教师评价', icon: 'teacher-eval' }
      },
      // 课程评价
      {
        path: 'course-eval',
        component: () => import('@/views/feedbackm/course-eval'),
        name: 'CourseEvaluation',
        meta: { title: '课程评价', icon: 'course-eval' }
      },
      // 学生评价
      {
        path: 'student-eval',
        component: () => import('@/views/feedbackm/student-eval'),
        name: 'StudentEvaluation',
        meta: { title: '学生评价', icon: 'student-eval' }
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
      title: '新闻管理',
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
  // 排课管理 course scheduling management
  {
    path: '/course-schedulingm',
    component: Layout,
    redirect: '/course-schedulingm',
    name: 'CourseSchedulingManagement',
    alwaysShow: true,
    // hidden: true,
    meta: {
      title: '排课管理',
      icon: 'course-scheduling'
    },
    children: [
      // 排课信息 course scheduling information
      {
        path: 'course-scheduling-info',
        component: () => import('@/views/course-schedulingm/course-scheduling-info'),
        name: 'CourseSchedulingInformation',
        meta: { title: '排课信息', icon: 'course-scheduling-info' }
      }
    ]
  },
  // 班级管理 class management
  {
    path: '/classm',
    component: Layout,
    redirect: '/classm',
    name: 'ClassManagement',
    alwaysShow: true,
    // hidden: true,
    meta: {
      title: '班级管理',
      icon: 'class'
    },
    children: [
      // 班级信息 class information
      {
        path: 'class-info',
        component: () => import('@/views/classm/class-info'),
        name: 'ClassInformation',
        meta: { title: '班级信息', icon: 'class-info' }
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
