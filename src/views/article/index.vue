<template>
  <div>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="form"
               :model="filterParams"
               label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <!-- /** 把索引变成字符串 index+'' -->
            <el-radio v-for="(item, index) in statTypes"
                      :key="item.label"
                      :label="index + ''">
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动区域">
          <article-channel v-model="filterParams.channel_id"></article-channel>
        </el-form-item>

        <el-form-item label="活动时间">
          <!-- /**如果不绑定v-model 就没法绑定change事件
           在v-model绑定个空的数组   / -->
          <el-date-picker value-format="yyyy-MM-dd"
                          v-model="lodeTime"
                          @change="handelChange"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :loading="loading"
                     @click="onSubmit">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>共找到{{totalCount}}条符合条件的内容</span>

      </div>
      <el-table :data="articles"
                v-loading="loading"
                style="width: 100%">
        <el-table-column prop="cover.images[0]"
                         label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.cover.images[0]"
                 alt=""
                 width="100"
                 height="100">
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="标题"
                         width="180">
        </el-table-column>
        <el-table-column prop="pubdate"
                         label="日期"
                         width="180">
        </el-table-column>
        <el-table-column prop="status"
                         label="状态">
          <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{statTypes[scope.row.status].label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status"
                         label="编辑">
          <template slot-scope="scope">
            <el-button type="primary"
                       @click="handelClick(scope.row)">删除</el-button>
            <el-button type="success"
                       @click="$router.push(`/publish/${scope.row.id}`)">编辑</el-button>
          </template>

        </el-table-column>
      </el-table>
      <el-pagination background
                     layout="prev, pager, next"
                     :total="totalCount"
                     :disabled='loading'
                     :current-page="page"
                     @current-change="getPagination">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
// const userInfo = window.localStorage.getItem('user-info')
import ArticleChannel from '@/components/article-channel'
export default {
  name: 'Article',
  components: {
    ArticleChannel
  },
  data () {
    return {
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: 'primary',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      value1: '',
      articles: [],
      // 初始化数据的数量
      totalCount: 0,
      // 初始化
      loading: false,
      // 默认1页
      page: 1,
      // 数据
      filterParams: {
        // 状态
        status: '',
        // 区域
        channel_id: '',
        // 开始时间
        begin_pubdate: '',
        // 借束时间
        end_pubdate: ''
      },
      // 定义一个空数组  绑定到 v-model上
      lodeTime: []
    }
  },
  created () {
    // 调用getContent()读取表格数据
    this.getContent()
  },
  methods: {
    // 封装获取数据 获取文章
    getContent (page = 1) {
      // 点击后禁止点击
      this.loading = true
      // 定义一个变量接收筛选后的数据
      const filterDate = {}
      // 过滤有效值得查询字段
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          filterDate[key] = this.filterParams[key]
        }
      }
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          // 页数
          page,
          // 一页默认有10条数据
          per_page: 10,
          ...filterDate
        }
      }).then(data => {
        console.log(data)
        this.articles = data.results
        // 把取得数据辅赋值给this.totalCount
        this.totalCount = data.total_count
        // 加载完后可以继续点击
        this.loading = false
      })
    },
    onSubmit () {
      this.page = 1
      this.getContent()
    },
    // 页面变化才会调用此函数
    getPagination (page) {
      // 把页数复值给this.page
      this.page = page
      // 调用函数改变页数 获取数据
      this.getContent(page)
    },
    // 删除
    handelClick (article) {
      console.log(article)
      this.$confirm('确定删除吗', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: `/articles/${article.id}`
        }).then(data => {
          console.log(data)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getContent(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 数据改变
    handelChange (value) {
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    }
  }
}

</script>
<style lang="less" scoped>
.box-card {
  margin-bottom: 30px;
}
</style>
