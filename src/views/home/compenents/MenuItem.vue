<template>
  <div class="menu-item">
    <div class="menu-icon">
      <i :class="icon" />
    </div>
    <div class="menu-name">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: '新建项目'
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss">
@import '~@/styles/element-variables.scss';
.menu-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  .menu-icon i {
    color: $--color-primary;
    font-size: 20px;
  }
}
.menu-item:hover {
  background-color: $--color-primary;
  cursor: pointer;
  .menu-icon i {
    color: #fff;
    font-size: 20px;
  }
  .menu-name {
    color: #fff;
  }
}
.menu-name {
  margin-left: 4px;
}
</style>
