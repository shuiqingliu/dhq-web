import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import {initMenu} from '@/utils/utils'
const whiteList = ['/login'] // 不重定向白名单
// initMenu(router, store)
// var p = store.state.user.p;
// console.log(p)
router.beforeEach((to, from, next) => {
  NProgress.start()
  // console.log(router)
  // var p = router.options.routes[2].path + '/' 
  
  if (getToken()) {
    if (to.path === '/login') {
      
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        initMenu(router, store)
        // console.log(p)
        // console.log(router.options.routes[1])
        store.dispatch('GetInfo').then(res => { // 拉取用户信
          next({...to})
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
