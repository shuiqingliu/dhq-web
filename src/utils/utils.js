import {getMenuList} from '@/api/sysmenu'
import {lazy} from './lazyloding'
import Layout from '@/views/layout/Layout'
export const initMenu = (router, store)=> {
  if (store.state.user.routes.length > 0) {
    return;
  }
  getMenuList().then(resp=> {
    if (resp && resp.code == 200) {
    //   alert(11)
  
      var fmtRoutes = formatRoutes(resp.data);
      console.log(fmtRoutes)
      router.addRoutes(fmtRoutes);
      var notFound = [{path: '*', redirect: '/404', hidden: true}];
      router.addRoutes(notFound);
      localStorage.setItem('routes',JSON.stringify(router.options.routes))
      console.log(router.options.routes)
    }
     
    
  })
}
//格式化routes
export const formatRoutes = (routes)=> {
  let fmRoutes = [];
  routes.forEach(router=> {
    let {
      name,
      path,
      component,
      redirect,
      hidden,
      children,
      meta
    } = router;
    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }
    let fmRouter = {
      name:name,
      path:path,
      component(resolve){
        if(component == 'Layout'){
          require(['../views/layout/Layout.vue'],resolve)
        }else{
          require(['../views'+component+'.vue'],resolve)
        }
      },
      redirect:redirect,
      hidden:hidden,
      children:children,
      meta:meta
    };
    fmRoutes.push(fmRouter);
  })
  return fmRoutes;
}