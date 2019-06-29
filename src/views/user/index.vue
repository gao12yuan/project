<template>
  <el-row>
    <el-col :span="10">
      <el-form>
        <el-form-item label="媒体名称">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="媒体简介">
          <el-input v-model="userInfo.intro"></el-input>
        </el-form-item>
        <el-form-item label="头条号ID">
          <el-input disabled
                    :value="userInfo.id && userInfo.id.toString()"></el-input>
        </el-form-item>
        <el-form-item label="用户手机">
          <el-input disabled
                    :value="userInfo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">保存更新</el-button>
        </el-form-item>
      </el-form>

    </el-col>
    <el-col :span="8"
            :offset="4">

      <el-upload class="avatar-uploader"
                 action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
                 :show-file-list="false"
                 :on-success="handleAvatarSuccess"
                 :before-upload="beforeAvatarUpload"
                 :http-request="handleUpload">
        <img v-if="userInfo.photo"
             :src="userInfo.photo"
             class="avatar">
        <i v-else
           class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'user',
  data () {
    return {
      userInfo: {}

    }
  },
  created () {
    this.getUser()
  },
  methods: {
    // 编辑用户资料
    onSubmit () {
      const { name, intro, email } = this.userInfo
      this.$http({
        method: 'PATCH',
        url: '/user/profile',
        data: {
          name,
          intro,
          email
        }
      }).then(data => {
        this.$store.commit('changeUser', data)
        this.$message({
          type: 'success',
          message: '更新用户信息成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新用户信息失败')
      })
    },
    // 读取用户信息
    getUser () {
      this.$http({
        method: 'GET',
        url: '/user/profile'
      }).then(data => {
        // console.log(data)
        this.userInfo = data
      })
    },
    handleAvatarSuccess () { },
    beforeAvatarUpload () { },
    handleUpload (data) {
      // console.log(data)
      const formData = new FormData()
      formData.append('photo', data.file)
      this.$http({
        method: 'PATCH',
        url: '/user/photo',
        data: formData
      }).then(data => {
        // console.log(data)
        this.userInfo.photo = data.photo
        this.$store.commit('changeUser', this.userInfo)
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('上传失败')
      })
    }
  }
}
</script>
<style lang="less" scoped>
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
