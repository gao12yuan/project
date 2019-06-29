<template>
  <el-card class="box-card">
    <el-table :data="article"
              style="width: 100%">
      <el-table-column prop="title"
                       label="标题"
                       width="300">
      </el-table-column>
      <el-table-column prop="total_comment_count"
                       label="总评论数"
                       width="180">
      </el-table-column>
      <el-table-column prop="fans_comment_count"
                       label="粉丝评论数">
      </el-table-column>
      <el-table-column label="允许评论">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.comment_status"
                     :disabled="scope.row.changeLoading"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     @change='handelChandeComment(scope.row)'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="comment_status"
                       label="操作">
        <el-button>修改</el-button>
      </el-table-column>
    </el-table>
    <el-pagination background
                   layout="prev, pager, next"
                   :total="1000">
    </el-pagination>
  </el-card>
</template>
<script>
export default {
  name: 'comment',
  data () {
    return {
      article: []
    }
  },
  created () {
    this.getComment()
  },
  methods: {
    getComment () {
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          response_type: 'comment'
        }
      }).then(data => {
        console.log(data)
        data.results.forEach(item => {
          item.changeLoading = false
        })
        this.article = data.results
      })
    },
    handelChandeComment (item) {
      item.changeLoading = true
      this.$http({
        method: 'PUT',
        url: '/comments/status',
        params: {
          article_id: item.id + ''
        },
        data: {
          allow_comment: item.comment_status
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改评论状态成功'
        })
        item.changeLoading = false
      }).catch(err => {
        console.log(err)
        item.comment_status = !item.comment_status
        this.$$message.error('修改评论状态失败')
        item.changeLoading = false
      })
    }

  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  margin-top: 30px;
}
</style>
