import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import {initMenu} from '@/utils/utils'
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
   //var routes = sessionStorage.getItem('routes')
  // console.log(JSON.parse(routes))
   //router.options.routes = JSON.parse(routes);
  // if(routes){
  //   router.options.routes = routes;
  // }
  if (getToken()) {
    
    // var routes = localStorage.getItem('routes')
    // router.options.routes = JSON.parse(routes);
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      initMenu(router, store)
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      }else{
        
        next()
      }
    }
  } else {
    
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
