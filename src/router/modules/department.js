/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'
import Sidelayout from '../../sidelayout'

const departmentRouter = {
  path: '/department',
  component: Sidelayout,
  // redirect: '/basedata/department',
  name: 'Department'
  // meta: {
  //   title: '基础数据',
  //   icon: 'example'
  // },
  // children: [
  //   {
  //     path: 'department',
  //     component: () => import('@/views/department'),
  //     name: 'Department',
  //     meta: { title: '部门管理', icon: 'example', affix: true }
  //   }
  // ]
}

export default departmentRouter

const createRoutesWithATree = tree => {
  const route = {
    path: `${tree.id}`,
    name: tree.name,
    component: () => import('@/views/department'),
    meta: { title: tree.name }
  }
  if (tree.children) {
    const routes = tree.children.map(e => createRoutesWithATree(e))
    const first = {
      path: `${tree.id}`,
      name: tree.name,
      component: () => import('@/views/department'),
      meta: { title: tree.name }
    }
    routes.unshift(first)
    route.children = routes
    route.redirect = `${route.path}/${routes[0].path}`
  }
  return route
}

const createDepartmentRoutes = trees => {
  return trees.map(tree => createRoutesWithATree(tree))
}

export { createDepartmentRoutes }
