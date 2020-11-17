/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'
import Sidelayout from '@/sidelayout'
import routerHelper from '@/router/routerHelper'

const operationRouter = {
  path: '/operation',
  component: Sidelayout,
  redirect: '/operation/customer',
  name: 'Operation',
  meta: {
    title: '经营管理',
    icon: 'example'
  },
  children: routerHelper.operationChildren
}

export default operationRouter

