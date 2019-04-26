import {getMenuList} from '@/api/sysmenu'

export const initMenu = (router, store)=> {
  if (store.state.user.routes.length > 0) {
    return;
  }
  getMenuList().then(resp=> {
    if (resp && resp.code == 200) {
    //   alert(11)
      if(!sessionStorage.getItem('routes') && router){
        var fmtRoutes = formatRoutes(resp.data);
        console.log(fmtRoutes)
        var notFound = [{path: '*', redirect: '/404', hidden: true}];

        if(router != undefined){
          router.addRoutes(fmtRoutes);
          router.addRoutes(notFound);
        }
        
        for(var router in fmtRoutes){
          router.options.routes.push(router)
        }
        router.options.routes.push(notFound)
        sessionStorage.setItem('routes',JSON.stringify(router.options.routes))
        console.log(router.options.routes)
        }
      
      
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