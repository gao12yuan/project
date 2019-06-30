<template>
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <span>图片管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active">
        <el-radio-button label="全部"
                         @click.native="handelCollect(false)">全部</el-radio-button>
        <el-radio-button label="收藏"
                         @click.native="handelCollect(true)">收藏</el-radio-button>
      </el-radio-group>
      <el-upload class="upload-demo"
                 action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                 :headers="{Authorization: `Bearer ${$store.state.user.token}`}"
                 name="image"
                 :on-success="handelSuccess"
                 :show-file-list="false">
        <el-button size="small"
                   type="primary">点击上传</el-button>
      </el-upload>

    </div>
    <el-row :gutter="20">
      <el-col :span="6"
              v-for="item in images"
              :key="item.id">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url"
               class="image">
          <div style="padding: 10px; display: flex; justify-content: center;">
            <el-button type="primary"
                       icon="el-icon-delete"
                       @click="handelDelete(item)"
                       circle
                       plain></el-button>
            <el-button type="primary"
                       :icon="item.is_collected ? 'el-icon-star-on': 'el-icon-star-off'"
                       @click="handelClick(item)"
                       circle
                       plain></el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination background
                   layout="prev, pager, next"
                   :disabled="countLoading"
                   :current-page="page"
                   @current-change="handelChange"
                   :total="totalCount">
    </el-pagination>

  </el-card>

</template>
<script>
export default {
  name: 'Userimage',
  data () {
    return {
      active: '全部',
      images: [],
      page: 1,
      countLoading: false,
      totalCount: 0,
      collect: false
    }
  },
  created () {
    // 调用函数
    this.handelCollect()
  },
  methods: {
    // 获取数据
    handelCollect (collect = false, page = 1) {
      this.countLoading = true
      this.$http({
        method: 'GET',
        url: '/user/images',
        params: {
          collect,
          per_page: 10,
          page
        }
      }).then(data => {
        console.log(data)
        this.images = data.results
        this.totalCount = data.total_count
        this.countLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 收藏
    handelClick (item) {
      const collect = !item.is_collected
      this.$http({
        method: 'PUT',
        url: `/user/images/${item.id}`,
        data: {
          collect: collect
        }
      }).then(data => {
        console.log(data)
        item.is_collected = collect
        // 刷新
        this.handelCollect()
        // 弹框
        this.$message({
          type: 'success',
          message: '收藏成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('收藏失败')
      })
    },
    // 删除
    handelDelete (item) {
      this.$http({
        method: 'DELETE',
        url: `/user/images/${item.id}`
      }).then(data => {
        console.log(data)
        // 刷新
        this.handelCollect()
        this.active = '全部'
        // 弹框
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('删除失败')
      })
    },
    // 上传
    handelSuccess () {
      this.handelCollect(false)
    },
    // 分页变化
    handelChange (page) {
      this.page = page
      console.log(page)
      this.handelCollect(this.collect, page)
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  .action {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
}
.image {
  width: 100%;
  height: 310px;
}
.el-pagination {
  margin-top: 50px;
}
</style>
