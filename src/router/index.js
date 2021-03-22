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
  // basedataRouter,
  // operationRouter
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
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
      },
      {
        path: 'admin',
        component: () => import('@/views/admin/index'),
        name: '管理员',
        meta: {
          title: '管理员',
          icon: 'el-icon-warning-outline'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/role/index'),
        name: '角色管理',
        meta: {
          title: '角色管理',
          icon: 'el-icon-warning-outline'
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    name: '用户管理',
    meta: {
      title: '用户管理',
      icon: 'el-icon-user-solid'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: '普通用户',
        meta: {
          title: '普通用户',
          icon: 'el-icon-user'
        }
      },
      {
        path: 'member',
        component: () => import('@/views/vip/userVip'),
        name: '会员用户',
        meta: {
          title: '会员用户',
          icon: 'el-icon-s-custom'
        }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/user/log',
    name: '财务管理',
    meta: {
      title: '财务管理',
      icon: 'el-icon-s-finance'
    },
    children: [
      {
        path: 'user',
        component: LayoutChild,
        redirect: '/finance/user/log',
        name: '用户财务',
        meta: {
          title: '用户财务',
          icon: 'el-icon-s-management'
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
        path: 'member',
        component: LayoutChild,
        redirect: '/finance/member/log',
        name: '会员财务',
        meta: {
          title: '会员财务',
          icon: 'el-icon-c-scale-to-original'
        },
        children: [
          {
            path: 'log',
            component: () => import('@/views/vip/log'),
            name: '会员流水',
            meta: {
              title: '会员流水',
              icon: 'el-icon-edit-outline'
            }
          },
          {
            path: 'cash',
            component: () => import('@/views/vip/cash'),
            name: '会员提现',
            meta: {
              title: '会员提现',
              icon: 'el-icon-suitcase'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/express',
    name: '订单管理',
    meta: {
      title: '订单管理',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'express',
        component: () => import('@/views/order/express'),
        name: '快递订单',
        meta: {
          title: '快递订单',
          icon: 'el-icon-truck'
        }
      },
      {
        path: 'pay',
        component: () => import('@/views/order/pay'),
        name: '支付订单',
        meta: {
          title: '支付订单',
          icon: 'el-icon-success'
        }
      },
      {
        path: 'mallOrder',
        component: () => import('@/views/mall/order'),
        name: '商城订单',
        meta: {
          title: '商城订单',
          icon: 'el-icon-s-shop'
        }
      },
      {
        path: 'realOrder',
        component: () => import('@/views/vip/order'),
        name: '实名订单',
        meta: {
          title: '实名订单',
          icon: 'el-icon-camera'
        }
      }
    ]
  },
  {
    path: '/lucky',
    component: Layout,
    redirect: '/lucky/goods/category',
    name: '抽奖后台',
    meta: {
      title: '抽奖后台',
      icon: 'el-icon-help'
    },
    children: [
      {
        path: 'goods',
        component: LayoutChild,
        redirect: '/lucky/goods/category',
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
        redirect: '/lucky/lucky/manage',
        name: '抽奖管理',
        meta: {
          title: '抽奖管理',
          icon: 'el-icon-help'
        },
        children: [
          {
            path: 'manage',
            component: () => import('@/views/luckyDraw/manage2'),
            name: '每日抽奖',
            meta: {
              title: '每日抽奖',
              icon: 'el-icon-info'
            }
          },
          {
            path: 'week',
            component: () => import('@/views/luckyDraw/week'),
            name: '每周抽奖',
            meta: {
              title: '每周抽奖',
              icon: 'el-icon-picture-outline-round'
            }
          },
          {
            path: 'draw',
            component: () => import('@/views/luckyDraw/draw2'),
            name: '每日开奖记录',
            meta: {
              title: '每日开奖记录',
              icon: 'el-icon-s-promotion'
            }
          },
          {
            path: 'drawWeek',
            component: () => import('@/views/luckyDraw/drawWeek'),
            name: '每周开奖记录',
            meta: {
              title: '每周开奖记录',
              icon: 'el-icon-s-promotion'
            }
          }
        ]
      },
      {
        path: 'egg',
        component: LayoutChild,
        redirect: '/lucky/egg/list',
        name: '彩蛋管理',
        meta: {
          title: '彩蛋管理',
          icon: 'el-icon-magic-stick'
        },
        children: [
          {
            path: 'list',
            component: () => import('@/views/egg/eggs'),
            name: '彩蛋列表',
            meta: {
              title: '彩蛋列表',
              icon: 'el-icon-present'
            }
          },
          {
            path: 'log',
            component: () => import('@/views/egg/log'),
            name: '彩蛋记录',
            meta: {
              title: '彩蛋记录',
              icon: 'el-icon-set-up'
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
      icon: 'el-icon-s-shop'
    },
    children: [
      {
        path: 'category',
        component: () => import('@/views/mall/category'),
        name: '分类管理',
        meta: {
          title: '分类管理',
          icon: 'el-icon-s-grid'
        }
      },
      {
        path: 'goods',
        component: () => import('@/views/mall/goods'),
        name: '商品管理',
        meta: {
          title: '商品管理',
          icon: 'el-icon-shopping-cart-2'
        }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    redirect: '/member/vip',
    name: '会员后台',
    meta: {
      title: '会员后台',
      icon: 'el-icon-s-check'
    },
    children: [
      {
        path: 'vip',
        component: () => import('@/views/vip/vip'),
        name: 'VIP设置',
        meta: {
          title: 'VIP设置',
          icon: 'el-icon-eleme'
        }
      },
      {
        path: 'svip',
        component: () => import('@/views/vip/svip'),
        name: 'SVIP设置',
        meta: {
          title: 'SVIP设置',
          icon: 'el-icon-platform-eleme'
        }
      },
      {
        path: 'agent',
        component: () => import('@/views/vip/agent'),
        name: '区域代理',
        meta: {
          title: '区域代理',
          icon: 'el-icon-share'
        }
      },
      {
        path: 'real',
        component: () => import('@/views/vip/real'),
        name: '实名认证',
        meta: {
          title: '实名认证',
          icon: 'el-icon-s-check'
        }
      },
      {
        path: 'bank',
        component: () => import('@/views/vip/bank'),
        name: '银行卡认证',
        meta: {
          title: '银行卡认证',
          icon: 'el-icon-bank-card'
        }
      }
    ]
  },

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
