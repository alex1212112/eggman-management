<template>
  <div class="menubar">
    <div
      v-for="(item, index) in menus"
      :key="index"
      class="menu-item-container"
    >
      <menu-item
        :name="item.name"
        :icon="item.icon"
        @click.native="itemClick(item, index)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuItem from './MenuItem'
export default {
  components: {
    MenuItem
  },
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  methods: {
    itemClick(item, index) {
      this.$emit('itemClick', { item, index })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.menubar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 66px;
}
.menu-item-container {
  font-size: 14px;
}
.menu-item-container + .menu-item-container {
  margin-left: 40px;
}
</style>
