<template>
  <div class="home">
    <div class="top">
      <div class="left">
        <div class="card">
          <el-card>
            <div slot="header" class="clearfix">
              <span>我的流程</span>
              <el-button style="float: right; padding: 3px 0" type="text"
                >全部</el-button
              >
            </div>
          </el-card>
        </div>
      </div>
      <div class="right">
        <div class="card">
          <el-card>
            <div slot="header" class="clearfix">
              <span>提醒事项</span>
              <el-button style="float: right; padding: 3px 0" type="text"
                >更多</el-button
              >
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="card">
        <el-card>
          <div slot="header" class="clearfix">
            <span>新闻</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >更多</el-button
            >
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss">
.home {
  .el-card {
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.home {
  // display: flex;
  padding: 25px 50px;
  .top {
    display: flex;
    height: 50%;
    .left {
      width: 50%;
    }
    .right {
      width: 50%;
    }
  }
  .bottom {
    height: 50%;
    width: 50%;
  }
  .card {
    padding: 16px;
    height: 100%;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
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
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
