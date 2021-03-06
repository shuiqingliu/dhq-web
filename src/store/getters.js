const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  routes: state => state.user.routes,
  id: state => state.user.id,
  p: state=> state.user.p
}
export default getters
