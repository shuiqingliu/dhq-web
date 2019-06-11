import {getMenuList} from '@/api/sysmenu'

export const initMenu = (router, store)=> {
  if (store.state.user.routes.length > 0) {
    return;
  }
  // console.log(router)
  getMenuList().then(resp=> {
    if (resp && resp.code == 200 && router.options.routes.length <= 3) {
      
        var fmtRoutes = formatRoutes(resp.data);
        var notFound = [{path: '*', redirect: '/404', hidden: true}];
       // console.log(router.options.routes)
        router.addRoutes(fmtRoutes);
        router.addRoutes(notFound);
        // console.log(router.options.routes)
        for(var route in fmtRoutes){
          router.options.routes.push(fmtRoutes[route])
        }
        router.options.routes.push(notFound)
        
        // console.log(router.options.routes[2])
        var p = router.options.routes[2].path + '/'+ router.options.routes[2].children[0].path;
        // store.commit('SET_P', )
        
        router.push({path: p})
        
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


export const fmtTree = (data)=> {
  let fmData = [];
  data.forEach( d => {
    let {
      id,
      children,
      meta
    } = d;
    if (children && children instanceof Array) {
      children = fmtTree(children);
    }
    let fmD = {
      id:id,
      label: meta == null? '首页': meta['title'],
     // disabled: meta == null || meta['title'] == '首页'? true: false,
      children:children,
    };
    fmData.push(fmD);
  })
  return fmData;
}
export const fmtRoles = (data)=> {
  let fmData = [];
  data.forEach( d => {
    let {
      id,
      description
    } = d;
    let fmD = {
      label: description,
      value: id
     // disabled: meta == null || meta['title'] == '首页'? true: false, 
    };
    fmData.push(fmD);
  })
  return fmData;
}

export const fmtInsTree = (data)=> {
  let fmData = [];
  data.forEach( d => {
    let {
      id,
      children,
      name,
      pid
    } = d;
    if (children && children instanceof Array) {
      children = fmtInsTree(children);
    }
    let fmD = {
      id:id,
      label: name,
      pid:pid,
     // disabled: meta == null || meta['title'] == '首页'? true: false,
      delAble: name == '董事会'? false: true,
      children:children,
    };
    fmData.push(fmD);
  })
  return fmData;
}




export const fmtOrganization = (data)=> {
  let fmData = [];
  data.forEach( d => {
    let {
      id,
      name,
    } = d;

    let fmD = {
      value:id,
      label: name,

    };
    fmData.push(fmD);
  })
  return fmData;
}