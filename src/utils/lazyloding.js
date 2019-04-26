import Layout from '@/views/layout/Layout'
function lazy(component) {
    
    if (component== 'Layout') {
      return 'Layout'
    } else {
      return () => import(`${component}`)
    }
  }
export {lazy}