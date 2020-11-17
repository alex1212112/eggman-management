export default {
  basedataChildren: [
    {
      path: 'user',
      component: () => import('@/views/user-manager'),
      name: 'User',
      meta: { title: '用户管理', icon: 'user', affix: true }
    },
    {
      path: 'subcontractor',
      component: () => import('@/views/subcontractor'),
      name: 'Subcontractor',
      meta: { title: '分包单位', icon: 'component', affix: true }
    },
    {
      path: 'workflow',
      component: () => import('@/views/workflow'),
      name: 'Workflow',
      meta: { title: '工作流管理', icon: 'component', affix: true }
    }
  ],
  operationChildren: [
    {
      path: 'customer',
      component: () => import('@/views/customer-manager'),
      name: 'Customer',
      meta: { title: '客户管理', icon: 'peoples', affix: true }
    },
    {
      path: 'contract',
      component: () => import('@/views/contract'),
      name: 'Customer',
      meta: { title: '合同管理', icon: 'documentation', affix: true }
    }
  ]
}
