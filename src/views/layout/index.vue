<template>
  <el-container>
    <el-aside width="200px">
      <Slide />
    </el-aside>
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// 引入路由
import Slide from './components/Slide'
import Header from './components/header'
export default {
  name: 'Layout',
  components: {
    Slide,
    Header
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    height: 100%;
    background-color: #535b63;
    .el-menu {
      border: 0;
    }
  }
}
.el-header {
  background-color: #fff;
}
.el-icon-arrow-down {
  background-color: #e8edf2;
}
</style>
