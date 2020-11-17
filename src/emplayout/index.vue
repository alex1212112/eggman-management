<template>
  <div :class="classObj" class="app-wrapper">
    <div class="">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
    </div>
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

import { AppMain, Navbar } from '@/emplayout/components'

import ResizeMixin from '@/layout/mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar
    // RightPanel,
    // Settings,
    // Sidebar,
    // TagsView,
    // Home
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
    }
  },
  methods: {
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
  position: relative;
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
  top: 105px;
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
