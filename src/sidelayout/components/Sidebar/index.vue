<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in filteredRoutes"
          :key="`${rootPath}/${route.path}`"
          :item="route"
          :base-path="`${rootPath}/${route.path}`"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import routerHelper from '@/router/routerHelper'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar', 'departmentRoutes']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    rootPath() {
      const fullPath = this.$route.fullPath
      const arr = fullPath.split('/').filter(e => !!e)
      return arr[0]
    },
    filteredRoutes() {
      if (this.rootPath === 'department') {
        const routes = this.departmentRoutes
        return routes
      }
      if (this.rootPath === 'basedata') {
        return routerHelper.basedataChildren
      }
      if (this.rootPath === 'operation') {
        return routerHelper.operationChildren
      }
      return []
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
