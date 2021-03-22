<template>
  <div :class="{'has-logo':showLogo}">
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
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { getScopes as newGetScopes } from '@/api/admin'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      modules: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    routes() {
      console.log(this.permission_routes)
      const newPath = this.permission_routes.filter(item => {
        return this.modules.includes(item.path)
      })
      console.log(newPath)
      return newPath
      // return this.$router.options.routes
    }
  },
  created() {
    this.getNewScopes()
  },
  methods: {
    getNewScopes() {
      newGetScopes().then(res => {
        console.log(res.data)
        this.modules = res.data
      })
    }
  }
}
</script>
