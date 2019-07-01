<template>
  <div>
    <div class="box-wrap"
         @click="handelClick">
      <p>点击选择图片</p>
      <i v-if="!value"
         style="margin-top: 20px;
      font-size: 90px; color: #eee;"
         class="iconfont icon-image_upload"></i>
      <img v-else
           width="120"
           :src="value">
    </div>
    <el-dialog :visible.sync="dialogVisible"
               width="30%">
      <el-tabs v-model="activeName">
        <el-tab-pane label="素材库"
                     name="first">素材库</el-tab-pane>
        <el-tab-pane label="上传图片"
                     name="second">
          <el-upload class="avatar-uploader"
                     action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                     :headers="{Authorization: `Bearer ${$store.state.user.token}`}"
                     name="image"
                     :on-success="handelSuccess"
                     :show-file-list="false">
            <img v-if="imageUrl"
                 :src="imageUrl"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>

      </el-tabs>

      <span slot="footer"
            class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary"
                   @click="handelOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
export default {
  name: 'updataImage',
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'second',
      imageUrl: null
    }
  },
  methods: {
    // 出现弹窗
    handelClick () {
      this.dialogVisible = true
    },
    // 上传成功
    handelSuccess (data) {
      console.log(data)
      this.imageUrl = data.data.url
    },
    handelOk () {
      console.log(11)
      this.$emit('input', this.imageUrl)
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.box-wrap {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
