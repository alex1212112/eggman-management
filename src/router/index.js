import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import LayoutChild from '@/layout/child'
// import Emplayout from '@/emplayout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
// import basedataRouter from './modules/basedata'
// import operationRouter from './modules/operation'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
  // {
  //   path: '/',
  //   component: Emplayout,
  //   redirect: '/home',
  //   children: [
  //     {
  //       path: 'home',
  //       component: () => import('@/views/home/index'),
  //       name: 'Home',
  //       meta: { title: '首页', icon: 'example', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // },
  // basedataRouter,
  // operationRouter
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/settingSystem',
    component: Layout,
    redirect: '/settingSystem/index',
    name: '系统管理',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/setting/index'),
        name: '系统设置',
        meta: {
          title: '系统设置',
          icon: 'el-icon-setting'
        }
      },
      {
        path: 'notice',
        component: () => import('@/views/setting/notice'),
        name: '系统消息',
        meta: {
          title: '系统消息',
          icon: 'el-icon-warning-outline'
        }
      }
    ]
  },
  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/user',
    name: '用户管理',
    meta: {
      title: '用户管理',
      icon: 'el-icon-user-solid'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: '用户管理',
        meta: {
          title: '用户管理',
          icon: 'el-icon-user'
        }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/log',
    name: '财务管理',
    meta: {
      title: '财务管理',
      icon: 'el-icon-s-finance'
    },
    children: [
      {
        path: 'log',
        component: () => import('@/views/other/log'),
        name: '用户流水',
        meta: {
          title: '用户流水',
          icon: 'el-icon-notebook-1'
        }
      },
      {
        path: 'cash',
        component: () => import('@/views/other/cash'),
        name: '用户提现',
        meta: {
          title: '用户提现',
          icon: 'el-icon-money'
        }
      }
    ]
  },
  {
    path: '/luckyAdmin',
    component: Layout,
    redirect: '/luckyAdmin/goods/category',
    name: '抽奖后台',
    meta: {
      title: '抽奖后台',
      icon: 'el-icon-help'
    },
    children: [
      {
        path: 'goods',
        component: LayoutChild,
        redirect: '/luckyAdmin/goods/category',
        name: '奖品管理',
        meta: {
          title: '奖品管理',
          icon: 'el-icon-star-on'
        },
        children: [
          {
            path: 'category',
            component: () => import('@/views/goods/category'),
            name: '奖品分类',
            meta: {
              title: '奖品分类',
              icon: 'el-icon-s-grid'
            }
          },
          {
            path: 'goods',
            component: () => import('@/views/goods/goods'),
            name: '奖品列表',
            meta: {
              title: '奖品列表',
              icon: 'el-icon-s-goods'
            }
          }
        ]
      },
      {
        path: 'lucky',
        component: LayoutChild,
        redirect: '/luckyAdmin/luck/manage',
        name: '抽奖管理',
        meta: {
          title: '抽奖管理',
          icon: 'lock'
        },
        children: [
          {
            path: 'manage',
            component: () => import('@/views/luckyDraw/manage2'),
            name: '抽奖设置',
            meta: {
              title: '抽奖设置'
            }
          },
          {
            path: 'week',
            component: () => import('@/views/luckyDraw/week'),
            name: '每周抽奖',
            meta: {
              title: '每周抽奖'
            }
          },
          {
            path: 'draw',
            component: () => import('@/views/luckyDraw/draw2'),
            name: '开奖记录',
            meta: {
              title: '开奖记录'
            }
          }
        ]
      },
      {
        path: 'egg',
        component: LayoutChild,
        redirect: '/luckyAdmin/egg/list',
        name: '彩蛋管理',
        meta: {
          title: '彩蛋管理',
          icon: 'lock'
        },
        children: [
          {
            path: 'list',
            component: () => import('@/views/egg/eggs'),
            name: '彩蛋列表',
            meta: {
              title: '彩蛋列表'
            }
          },
          {
            path: 'log',
            component: () => import('@/views/egg/log'),
            name: '彩蛋记录',
            meta: {
              title: '彩蛋记录'
            }
          }
        ]
      },
      {
        path: 'order',
        component: LayoutChild,
        redirect: '/luckyAdmin/order/express',
        name: '订单管理',
        meta: {
          title: '订单管理',
          icon: 'lock'
        },
        children: [
          {
            path: 'express',
            component: () => import('@/views/order/express'),
            name: '快递订单',
            meta: {
              title: '快递订单'
            }
          },
          {
            path: 'pay',
            component: () => import('@/views/order/pay'),
            name: '支付订单',
            meta: {
              title: '支付订单'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    redirect: '/mall/category',
    name: '商城后台',
    meta: {
      title: '商城后台',
      icon: 'lock'
    },
    children: [
      {
        path: 'category',
        component: () => import('@/views/mall/category'),
        name: '分类管理',
        meta: {
          title: '分类管理'
        }
      },
      {
        path: 'goods',
        component: () => import('@/views/mall/goods'),
        name: '商品管理',
        meta: {
          title: '商品管理'
        }
      },
      {
        path: 'order',
        component: () => import('@/views/mall/order'),
        name: '订单管理',
        meta: {
          title: '订单管理'
        }
      }
    ]
  },
  {
    path: '/vip',
    component: Layout,
    redirect: '/vip/vip',
    name: '会员后台',
    meta: {
      title: '会员后台',
      icon: 'lock'
    },
    children: [
      {
        path: 'vip',
        component: () => import('@/views/vip/vip'),
        name: 'VIP设置',
        meta: {
          title: 'VIP设置'
        }
      },
      {
        path: 'svip',
        component: () => import('@/views/vip/svip'),
        name: 'SVIP设置',
        meta: {
          title: 'SVIP设置'
        }
      },
      {
        path: 'agent',
        component: () => import('@/views/vip/agent'),
        name: '区域代理',
        meta: {
          title: '区域代理'
        }
      },
      {
        path: 'user',
        component: () => import('@/views/vip/userVip'),
        name: '会员用户',
        meta: {
          title: '会员用户'
        }
      },
      {
        path: 'order',
        component: () => import('@/views/vip/order'),
        name: '实名订单',
        meta: {
          title: '实名订单'
        }
      },
      {
        path: 'real',
        component: () => import('@/views/vip/real'),
        name: '实名认证',
        meta: {
          title: '实名认证'
        }
      },
      {
        path: 'bank',
        component: () => import('@/views/vip/bank'),
        name: '银行卡认证',
        meta: {
          title: '银行卡认证'
        }
      },
      {
        path: 'cash',
        component: () => import('@/views/vip/cash'),
        name: '会员提现',
        meta: {
          title: '会员提现'
        }
      },
      {
        path: 'log',
        component: () => import('@/views/vip/log'),
        name: '会员流水',
        meta: {
          title: '会员流水'
        }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  // basedataRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'el-icon-s-help'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: {
  //         title: 'Edit Article',
  //         noCache: true,
  //         activeMenu: '/example/list'
  //       },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },
  //
  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
