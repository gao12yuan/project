<template>
  <el-row class="header">
    <el-col :span="14">
      <p>江苏传智播客教育科技股份有限公司</p>
    </el-col>
    <el-col :span="5" :push="5">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img width="30"
               :src="userInfo.photo"
               alt="">
          {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>账户设置</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'Header',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    // 打开页面直接显示
    this.userInfo = JSON.parse(window.localStorage.getItem('user-info'))
  }
}
</script>
<style lang="less" scoped>
.header {
  height: 60px;
  display: flex;
  align-items: center;
  .el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      margin-right: 5px;
    }
  }
}
</style>
