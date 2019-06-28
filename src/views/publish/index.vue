<template>
  <el-card>
    <div slot="header"
         class="clearfix">
      <span>发布文章</span>
    </div>
    <el-form label-width="80px"
             v-loading="isEdit && formLoading">
      <el-form-item label="标题">
        <el-input placeholder="文章标题"
                  v-model="pubishContent.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <quill-editor ref="myQuillEditor"
                      v-model="pubishContent.content"
                      :options="editorOption">
        </quill-editor>

      </el-form-item>
      <el-form-item label="封面">
        <el-radio-group>
          <el-radio label="单图"></el-radio>
          <el-radio label="三图"></el-radio>
          <el-radio label="无图"></el-radio>
          <el-radio label="自动"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道">
        <article-channel v-model="pubishContent.channel_id"></article-channel>
      </el-form-item>
    </el-form>
    <el-button type="success"
               :loading="publishLoading"
               @click="handelPost(false)">{{isEdit ? '更新' : '发表'}}</el-button>
    <el-button type="primary"
               :loading="publishLoading"
               @click="handelPost(true)">存入草稿</el-button>
  </el-card>
</template>
<script>

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import ArticleChannel from '@/components/article-channel'
export default {
  components: {
    quillEditor,
    ArticleChannel
  },
  name: 'publish',
  data () {
    return {
      editorOption: {
        // some quill options
      },
      pubishContent: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: ''
      },
      formLoading: false,
      publishLoading: false
    }
  },
  created () {
    console.log(this.$route)
    if (this.isEdit) {
      this.loadArticle()
    }
  },
  methods: {
    onEditorChange ({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
    },
    // 发布文章
    submitAdd (draft) {
      return this.$http({
        method: 'POST',
        url: '/articles',
        data: this.pubishContent,
        params: {
          draft
        }
      }).then(data => {
        // console.log(data)
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('发布')
      })
    },
    // 修改文章
    submitUpdate (draft) {
      return this.$http({
        method: 'PUT',
        url: `/articles/${this.isId}`,
        params: {
          draft
        },
        data: this.pubishContent
      }).then(data => {
        this.pubishContent = data
      }).catch(err => {
        console.log(err)
        this.$message.error('发布')
      })
    },
    handelPost (draft = false) {
      this.publishLoading = true
      if (this.isEdit) {
        this.submitUpdate(draft).then(() => {
          this.publishLoading = false
        })
      } else {
        this.submitAdd(draft).then(() => {
          this.publishLoading = false
        })
      }
    },

    // 编辑文章获取文章信息
    loadArticle () {
      this.formLoading = true
      this.$http({
        method: 'GET',
        url: `/articles/${this.isId}`
      }).then(data => {
        console.log(data)
        this.pubishContent = data
        this.formLoading = false
      }).catch(err => {
        console.log(err)
        this.$message.error('加载详情失败')
      })
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    isEdit () {
      return this.$route.name === 'publish-edit'
    },
    isId () {
      return this.$route.params.id
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  }
}
</script>
<style lang="less" scoped>
.el-button {
  margin-bottom: 3px;
}
</style>
