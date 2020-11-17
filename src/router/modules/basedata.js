/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'
import Sidelayout from '@/sidelayout'
import routerHelper from '@/router/routerHelper'

const baseDataRouter = {
  path: '/basedata',
  component: Sidelayout,
  redirect: '/basedata/user',
  name: 'BaseData',
  meta: {
    title: '基础数据',
    icon: 'example'
  },
  children: routerHelper.basedataChildren
}

export default baseDataRouter

