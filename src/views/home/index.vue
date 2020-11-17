<template>
  <div class="home-container">
    <menubar :menus="menus" class=" menu-wrap" @itemClick="menuClick" />
    <home class="home-wrap" />
  </div>
</template>

<script>
// import RightPanel from '@/components/RightPanel'
// import {
//   AppMain,
//   Navbar,
//   Settings,
//   Sidebar,
//   TagsView
// } from '@/layout/components'

import { Home, Menubar } from '@/views/home/compenents'

import ResizeMixin from '@/layout/mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    // AppMain,
    Menubar,
    // RightPanel,
    // Settings,
    // Sidebar,
    // TagsView,
    Home
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    menus() {
      return [
        {
          name: '基础数据',
          icon: 'el-icon-s-order',
          tag: 'basedata'
        },
        {
          name: '部门管理',
          icon: 'el-icon-s-order',
          tag: 'department'
        },
        {
          name: '经营管理',
          icon: 'el-icon-s-order',
          tag: 'operation'
        },
        {
          name: '项目管理',
          icon: 'el-icon-s-order'
        },
        {
          name: '用章管理',
          icon: 'el-icon-s-order'
        }
      ]
    }
  },
  methods: {
    async menuClick(menu) {
      if (menu.item.tag === 'department') {
        await this.$store.dispatch('department/resetDepartmentRoutes')
        this.$router.push('/department')
        return
      }
      if (menu.item.tag === 'basedata') {
        this.$router.push('/basedata')
        return
      }
      if (menu.item.tag === 'operation') {
        this.$router.push('/operation')
        return
      }
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.home-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  // margin-left: $sideBarWidth;
  margin-left: 0;
  // position: relative;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.menu-wrap {
  top: 1px;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  // width: calc(100% - #{$sideBarWidth});
  width: calc(100%);
  transition: width 0.28s;
}
.fixed-menu {
  position: fixed;
  top: 51px;
  right: 0;
  z-index: 9;
  width: calc(100%);
  transition: width 0.28s;
}

.home-wrap {
  position: absolute;
  top: 50px;
  bottom: 0;
  left: 0;
  right: 0;
}

.hideSidebar .fixed-header {
  // width: calc(100% - 54px);
  width: calc(100%);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
